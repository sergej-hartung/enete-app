import { Component, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AttributeService } from '../../../../../services/product/tariff/attribute/attribute.service';
import { ProductService } from '../../../../../services/product/product.service';
import { AttributeGroupService } from '../../../../../services/product/tariff/attribute-group/attribute-group.service';
import { Subject, delay, of, takeUntil } from 'rxjs';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';
import { MainNavbarService } from '../../../../../services/main-navbar.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditorModalComponent } from '../../../../../shared/components/editor-modal/editor-modal.component'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormService } from '../../../../../services/form.service';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';

interface Group {
  id?: number;
  name: string;
  attributes: Attribute[];
  form: FormGroup; // Убедимся, что form всегда определяется как FormGroup
  hidden?: boolean;
}

@Component({
  selector: 'app-tariff-attribute',
  templateUrl: './tariff-attribute.component.html',
  styleUrls: ['./tariff-attribute.component.scss']
})
export class TariffAttributeComponent {
  tariffAttributes: Attribute[] = [];
  groups: Group[] = [];

  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId];

  attributsGroupForm: FormArray

  addNewGroup = false;
  newGroupForm: FormGroup;
  editGroupIndex: number | null = null;
  editGroupForm: FormGroup;
  groupId: number | null = null;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private attributeService: AttributeService,
    private productService: ProductService,
    private mainNavbarService: MainNavbarService,
    private attributeGroupService: AttributeGroupService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private formService: FormService,
    public tariffService: TariffService,
  ) {
    const tariffForm = this.formService.getTariffForm()
    this.attributsGroupForm = tariffForm.get('attribute_groups') as FormArray

    this.newGroupForm = this.fb.group({
      groupName: ['', Validators.required]
    });

    this.editGroupForm = this.fb.group({
      groupName: ['', Validators.required]
    });

  }

  ngOnInit() { 
    this.productService.tariffGroupId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id => {
        if (id && this.groupId !== id) {
          this.groupId = id;
          this.attributeService.fetchDataByGroupId(this.groupId);
        }
      });

    this.attributeService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if (data && data.entityType === 'tariffAttributesByGroup') {
          this.tariffAttributes = data.data;
          this.updateTariffAttributesStatus(); // Обновление статуса после получения атрибутов
          console.log('Loaded Attributes:', data);
        }
      });
      this.productService.productMode$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(mode => {
          if(mode == 'edit')  this.loadAttributeGroups();
        })
  }

  ngOnChanges(changes: SimpleChanges) {   
    this.updateConnectedDropLists();
  }


  openEditor(group: Group, index: number) {

    const modalRef: NgbModalRef = this.modalService.open(
      EditorModalComponent, 
      {
        backdropClass: 'ckedit-modal-backdrop', 
        windowClass: 'ckedit-modal',
        size: 'lg' 
      }
    );
    const control = (group.form.get('attributes') as FormArray).at(index);
    let text = control.get('value_text')
    const attribute = group.attributes[index];
    if(attribute.pivot){
      text?.setValue(attribute.pivot?.value_text)
      modalRef.componentInstance.initialValue = text?.value || '';
    }else{
      //const control = (group.form.get('attributes') as FormArray).at(index);
      modalRef.componentInstance.initialValue = text?.value || '';
    }
    
    modalRef.componentInstance.saveText.pipe(takeUntil(this.unsubscribe$)).subscribe((result: string) => {
      if (result !== undefined ) {
        //const control = (group.form.get('attributes') as FormArray).at(index);
        control.patchValue({ value_text: result });
        //attribute.pivot.value_text = result;
        console.log('Сохранено значение:', result);
        text?.markAsTouched()
        modalRef.close(); // Закрытие модального окна после сохранения
      }
    });
    modalRef.componentInstance.close.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      console.log('fenster geschlossen')
      text?.markAsTouched()
      modalRef.close(); // Закрытие модального окна при нажатии на отмену
    });
  }


  addNewGroupName() {
    this.addNewGroup = true;
    this.newGroupForm.reset();
  }

  saveNewGroup() {
    if (this.newGroupForm.valid) {
      const newGroup: Group = {
        name: this.newGroupForm.value.groupName,
        attributes: [],
        form: this.fb.group({
          id: [null],
          name: [this.newGroupForm.value.groupName],
          attributes: this.fb.array([])
        })
      };
      this.groups.push(newGroup);
      this.attributsGroupForm.push(newGroup.form);
      this.updateConnectedDropLists();
      this.addNewGroup = false;
      this.newGroupForm.reset();
    }
  }

  cancelNewGroup() {
    this.addNewGroup = false;
    this.newGroupForm.reset();
  }

  editGroup(index: number) {
    this.editGroupIndex = index;
    this.editGroupForm.setValue({ groupName: this.groups[index].name });
  }

  saveEditedGroup() {
    if (this.editGroupForm.valid && this.editGroupIndex !== null) {
      this.groups[this.editGroupIndex].name = this.editGroupForm.value.groupName;
      const groupForm = this.attributsGroupForm.at(this.editGroupIndex) as FormGroup;
      groupForm.patchValue({ name: this.editGroupForm.value.groupName });
      this.editGroupIndex = null;
      this.editGroupForm.reset();
    }
  }

  cancelEditGroup() {
    this.editGroupIndex = null;
    this.editGroupForm.reset();
  }

  removeGroup(index: number) {
    this.groups.splice(index, 1);
    this.attributsGroupForm.removeAt(index);
    this.updateConnectedDropLists();
    this.updateTariffAttributesStatus(); // Обновление статуса после удаления группы
  }

  toggleGroupAttributes(index: number) {
    this.groups[index].hidden = !this.groups[index].hidden;
  }

  getGroupDropListId(index: number): string {
    return `groupDropList-${index}`;
  }

  updateConnectedDropLists() {
    this.connectedDropLists = [this.tariffDropListId, ...this.groups.map((_, index) => this.getGroupDropListId(index))];
  }

  drop(event: CdkDragDrop<any[]>, group?: Group) {
    if (event.previousContainer === event.container && group) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.moveItemInFormArray(group!.form.get('attributes') as FormArray, event.previousIndex, event.currentIndex);
    } else {
      if (group) {
        const attribute = event.previousContainer.data[event.previousIndex];
        const attributeExists = group.attributes.some(attr => attr.id === attribute.id);
        if (!attributeExists) {
          let copiedAttribute = { ...attribute, isCopied: true, isFocused: false }; // isFocused по умолчанию false
          if(!attribute.is_frontend_visible){
            copiedAttribute = {...copiedAttribute, isActiveDesibled: true }
          }
          group.attributes.splice(event.currentIndex, 0, copiedAttribute);
          
          
          const originalAttribute = this.tariffAttributes.find(attr => attr.id === attribute.id);
          if (originalAttribute) {
            originalAttribute.isCopied = true;
          }
  
          const groupFormArray = group.form.get('attributes') as FormArray;
          groupFormArray.insert(event.currentIndex, this.createAttributeFormControl(attribute));
          // groupFormArray.insert(event.currentIndex, this.fb.group({
          //   id: [attribute.id],
          //   code: [attribute.code],
          //   name: [attribute.name],
          //   value_varchar: [null],
          //   value_text: [null],
          //   is_active: [attribute.is_frontend_visible]
          // }));
        }
        console.log(this.groups)
      }
    }
  }

  private createAttributeFormControl(attribute: Attribute, valueVarchar: string = '', valueText: string = '', isActive: number | null = null): FormGroup {
    const valueVarcharValidators = [];
    const valueTextValidators = [];

    if (attribute.is_required) {
        if (attribute.input_type === 'Textbereich') {
            valueTextValidators.push(Validators.required);
        } else {
            valueVarcharValidators.push(Validators.required);
        }
    }

    switch (attribute.input_type) {
        case 'Ganzzahlen':
            valueVarcharValidators.push(Validators.pattern(/^\d+$/)); // Только целые числа
            break;
        case 'Dezimalzahlen':
            valueVarcharValidators.push(Validators.pattern(/^\d+(,\d+)?$/)); // Десятичные числа
            break;
        case 'Datumfeld':
            valueVarcharValidators.push(Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)); // Дата в формате ГГГГ-ММ-ДД
            break;
        case 'Link-Feld':
            valueVarcharValidators.push(Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)); // URL
            break;
        case 'Boolescher Wert':
            valueVarcharValidators.push(Validators.pattern(/^(0|1)$/)); // Булевый (0 или 1)
            break;
        case 'Dateifeld':
            // Для поля файла можно добавить валидатор на допустимые расширения файлов, если нужно
            break;
        case 'Dropdown':
            // Для выпадающего списка специфические валидаторы не нужны
            break;
        case 'Mehrfachauswahl':
            // Для множественного выбора специфические валидаторы не нужны
            break;
        case 'Textfeld':
            // Для текстового поля специфические валидаторы не нужны
            break;
        case 'Textbereich':
            // Валидаторы добавлены выше
            break;
        default:
            // Для других типов данных добавьте свои валидаторы, если необходимо
            break;
    }
    //console.log(attribute)
    return this.fb.group({
        id: [attribute.id],
        code: [attribute.code],
        name: [attribute.name],
        unit: [attribute.unit],
        value_varchar: [valueVarchar, valueVarcharValidators],
        value_text: [valueText, valueTextValidators],
        is_active: [isActive !== null ? isActive : attribute.is_frontend_visible]
    });
  }


  private moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number) {
    const item = formArray.at(fromIndex);
    formArray.removeAt(fromIndex);
    formArray.insert(toIndex, item);
  }

  getDropdownOptions(attribute: Attribute) {
    if (attribute.input_type === 'Dropdown' && attribute.details) {
      const details = JSON.parse(attribute.details);
      return details.options || [];
    }
    return [];
  }

  removeAttribute(group: Group, attribute: Attribute) {
    const index = group.attributes.indexOf(attribute);
    if (index >= 0) {
      const originalAttribute = this.tariffAttributes.find(attr => attr.code === attribute.code);
      if (originalAttribute) {
        originalAttribute.isCopied = false;
        this.productService.deletedTariffAttr.emit(originalAttribute)
      }
      group.attributes.splice(index, 1);

      // Удаление FormControl для атрибута
      const groupFormArray = group.form.get('attributes') as FormArray;
      const formIndex = groupFormArray.controls.findIndex(ctrl => ctrl.value.id === attribute.id);
      if (formIndex >= 0) {
        groupFormArray.removeAt(formIndex);
      }

    }
  }

  setFocus(group: Group, index: number) {
    group.attributes[index].isFocused = true;
  }

  removeFocus(group: Group, index: number) {
    group.attributes[index].isFocused = false;
  }

  canDropToTariffList = (drag: any) => {
    return drag.dropContainer.id === this.tariffDropListId;
  }

  private loadAttributeGroups() {
    if (this.groupId) {
      this.tariffService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          if(response){
            const groupsFromTariff = response?.data?.attribute_groups; // Здесь ваши группы из ответа сервера
            if(groupsFromTariff){
              this.groups = groupsFromTariff.map(group => 
              (
                {
                  id: group.id,
                  name: group.name,
                  attributes: group.attributs.map(attr => 
                    ({
                      ...attr,
                      isCopied: true, // Отметьте атрибуты как скопированные
                      ...(attr?.is_frontend_visible === 0 || attr?.is_frontend_visible === false ? { isActiveDesibled: true } : {})
                    })
                  ),
                  hidden: false,
    
                  form: this.fb.group({
                    id: [group.id],
                    name: [group.name],
                    attributes: this.fb.array(
                      group.attributs.map(attr => this.createAttributeFormControl(
                        attr, attr?.pivot?.value_varchar || '', 
                        attr?.pivot?.value_text || '', 
                        attr?.pivot?.is_active
                      ))
                    )
                  })
                }
              ));

              this.attributsGroupForm.clear();
              this.groups.forEach(group => {
                this.attributsGroupForm.push(group.form);
              });

              this.updateTariffAttributesStatus();
              this.updateConnectedDropLists();
            }
          }
        })
      
    }
  }

  toogleFrontentVisible(attribute:Attribute, control:any){
    console.log(attribute)
    let isActive = control.get('is_active')
    if(isActive?.value){
      control.get('is_active')?.setValue(0)
      attribute.is_frontend_visible = 0
    }else{
      control.get('is_active')?.setValue(1)
      attribute.is_frontend_visible = 1
    }
    console.log(control.get('is_active'))
  }

  private updateTariffAttributesStatus() {
    // Создаем Set из всех id атрибутов, которые есть в группах
    const copiedAttributeIds = new Set(this.groups.flatMap(group => group.attributes.map(attr => attr.id)));

    // Обновляем статус `isCopied` для атрибутов в правой колонке
    this.tariffAttributes.forEach(attribute => {
      attribute.isCopied = copiedAttributeIds.has(attribute.id);
    });
  }

  // Метод для безопасного приведения типов и получения FormArray
  getAttributeFormArray(group: Group): FormArray {
    return group.form.get('attributes') as FormArray;
  }

  // Метод для безопасного приведения типов и получения FormGroup
  getFormGroupFromArray(group: FormArray, index: number): FormGroup {
    return group.at(index) as FormGroup;
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  isRequired(control: AbstractControl | null): boolean {
    if (control && control.validator) {
      const validator = control.validator({} as AbstractControl);
      return validator && validator['required'];
    }
    return false;
  }
  
  // Метод для безопасного получения FormControl из FormArray
  getAttributeFormControl(group: FormGroup, index: number, controlName: string): AbstractControl | null {
    const formArray = group.get('attributes') as FormArray;
    const formGroup = formArray.at(index) as FormGroup;
    return formGroup.get(controlName);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}



