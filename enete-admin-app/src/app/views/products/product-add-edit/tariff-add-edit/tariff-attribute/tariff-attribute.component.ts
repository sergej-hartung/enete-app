import { Component, OnDestroy, SimpleChanges } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AttributeService } from '../../../../../services/product/tariff/attribute/attribute.service';
import { ProductService } from '../../../../../services/product/product.service';
import { AttributeGroupService } from '../../../../../services/product/tariff/attribute-group/attribute-group.service';
import { Observable, Subject, delay, of, take, takeUntil } from 'rxjs';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';
import { MainNavbarService } from '../../../../../services/main-navbar.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditorModalComponent } from '../../../../../shared/components/editor-modal/editor-modal.component'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormService } from '../../../../../services/form.service';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { AttributeGroup } from '../../../../../models/tariff/attributeGroup/attributeGroup'

interface Group {
  id?: number;
  name: string;
  attributs: Attribute[];
  form: FormGroup;
  hidden?: boolean;
}

@Component({
  selector: 'app-tariff-attribute',
  templateUrl: './tariff-attribute.component.html',
  styleUrls: ['./tariff-attribute.component.scss']
})
export class TariffAttributeComponent implements OnDestroy {
  tariffAttributs: Attribute[] = [];
  groups: Group[] = [];
  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId];

  tariffForm: FormGroup
  attributeGroupsForm: FormArray;

  addNewGroup = false;
  newGroupForm: FormGroup;
  editGroupIndex: number | null = null;
  editGroupForm: FormGroup;
  groupId: number | null = null;

  private unsubscribe$ = new Subject<void>();
  private detailedDataSubscription: any;

  constructor(
    private fb: FormBuilder,
    private attributeService: AttributeService,
    private productService: ProductService,
    // private mainNavbarService: MainNavbarService,
    // private attributeGroupService: AttributeGroupService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private formService: FormService,
    public tariffService: TariffService,
  ) {
    this.tariffForm = this.formService.getTariffForm();
    this.attributeGroupsForm = this.tariffForm.get('attribute_groups') as FormArray;

    this.newGroupForm = this.fb.group({
      groupName: ['', Validators.required]
    });

    this.editGroupForm = this.fb.group({
      groupName: ['', Validators.required]
    });

    this.initializeSubscriptions();
  }



  private initializeSubscriptions() {
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
        if (data && data.entityType === 'tariffAttributsByGroup') {
          this.tariffAttributs = data.data;
          this.updateTariffAttributsStatus();
        }
      });

    this.productService.productMode$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(mode => {
        if (mode === 'edit') this.loadAttributeGroups();
      });
  }


  openEditor(event: Event, group: Group, index: number) {
    event.preventDefault();
    (event.target as HTMLElement).blur();

    const modalRef = this.openModal();
    const control = this.getAttributeFormArray(group).at(index) as FormGroup;
    const textControl = control.get('value_text');
    const attribute = group.attributs[index];

    textControl?.setValue(attribute.pivot?.value_text || textControl?.value || '');
    modalRef.componentInstance.initialValue = textControl?.value || '';

    this.handleModalSaveClose(modalRef, control, textControl);
  }

  private openModal(): NgbModalRef {
    return this.modalService.open(EditorModalComponent, {
      backdropClass: 'ckedit-modal-backdrop',
      windowClass: 'ckedit-modal',
      size: 'lg'
    });
  }

  private handleModalSaveClose(modalRef: NgbModalRef, control: AbstractControl, textControl: AbstractControl | null): void {
    const markAsTouchedAndClose = () => {
      textControl?.markAsTouched();
      modalRef.close();
    };

    modalRef.componentInstance.saveText.pipe(take(1)).subscribe((result: any) => {
      if (result !== undefined) {
        control.patchValue({ value_text: result });
        markAsTouchedAndClose();
      }
    });

    modalRef.componentInstance.close.pipe(take(1)).subscribe(markAsTouchedAndClose);
  }

  addNewGroupName() {
    this.addNewGroup = true;
    this.newGroupForm.reset();
  }

  saveNewGroup() {
    if (this.newGroupForm.valid) {
      const newGroup: Group = {
        name: this.newGroupForm.value.groupName,
        attributs: [],
        form: this.createGroupForm(this.newGroupForm.value.groupName)
      };
      this.groups.push(newGroup);
      this.attributeGroupsForm.push(newGroup.form);
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
      const group = this.groups[this.editGroupIndex];
      group.name = this.editGroupForm.value?.groupName;
      (this.attributeGroupsForm.at(this.editGroupIndex) as FormGroup).patchValue({ name: this.editGroupForm.value?.groupName });
      this.editGroupIndex = null;
      this.editGroupForm.reset();
    }
  }

  cancelEditGroup() {
    this.editGroupIndex = null;
    this.editGroupForm.reset();
  }

  removeGroup(index: number) {
    this.productService.deletedTariffAttrGroup.emit(this.groups.at(index));
    this.groups.splice(index, 1);
    this.attributeGroupsForm.removeAt(index);
    this.updateConnectedDropLists();
    this.updateTariffAttributsStatus();
  }

  toggleGroupAttributs(index: number) {
    this.groups[index].hidden = !this.groups[index].hidden;
  }

  getGroupDropListId(index: number): string {
    return `groupDropList-${index}`;
  }

  updateConnectedDropLists() {
    this.connectedDropLists = [this.tariffDropListId, ...this.groups.map((_, index) => this.getGroupDropListId(index))];
  }



  drop(event: CdkDragDrop<any[]>, group?: Group) {
    if (!group) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.moveControlInFormArray(group.form.get('attributs') as FormArray, event.previousIndex, event.currentIndex);
    } else {
      const attribute = event.previousContainer.data[event.previousIndex];
      if (!this.attributeExistsInGroup(group, attribute)) {
        const copiedAttribute = this.copyAttribute(attribute);
        group.attributs.splice(event.currentIndex, 0, copiedAttribute);
        this.addControlToFormArray(group.form.get('attributs') as FormArray, this.createAttributeFormControl(attribute), event.currentIndex);

        const originalAttribute = this.findOriginalAttribute(attribute);
        if (originalAttribute) originalAttribute.isCopied = true;
      }
    }
  }

  private copyAttribute(attribute: Attribute): Attribute {
    if(attribute?.pivot){
      const isActiveDisabled = !attribute.is_frontend_visible
      let isActiv = attribute?.pivot.is_active
      if(isActiv !== attribute.is_frontend_visible){
        if(!attribute.is_frontend_visible && isActiv){
          isActiv = 0
        }else if(!isActiv && attribute.is_frontend_visible) isActiv = 0
      }

      let Attr: Attribute = JSON.parse(JSON.stringify(attribute))
      Attr.is_frontend_visible = isActiv 
      delete Attr?.pivot;

      return {
        ...Attr,
        isCopied: true,
        isFocused: false,
        isActiveDisabled: isActiveDisabled
      };

    }
    return {
      ...attribute,
      isCopied: true,
      isFocused: false,
      isActiveDisabled: !attribute.is_frontend_visible
    };
  }

  private createGroupForm(name: string, attributs: Attribute[] = []): FormGroup {
    return this.fb.group({
      id: [null],
      name: [name],
      uniqueId: [this.generateUniqueIdWithTimestamp()],
      attributs: this.fb.array(
        attributs.map(attr => {
          if(attr?.pivot){
            let valueVarchar = attr?.pivot?.value_varchar ? attr.pivot.value_varchar : ''
            let valueText = attr?.pivot?.value_text ? attr.pivot.value_text : ''
            let isActive = attr?.pivot?.is_active ? attr.pivot.is_active : null
            return this.createAttributeFormControl(attr, valueVarchar, valueText, isActive)
          }

          return this.createAttributeFormControl(attr)
        })
      )
    });
  }

 

  private createAttributeFormControl(attribute: Attribute, valueVarchar: string = '', valueText: string = '', isActive: number | null = null): FormGroup {
    const valueVarcharValidators = attribute.input_type !== 'Textbereich' ? this.getValidatorsForType(attribute) : [];
    const valueTextValidators = attribute.input_type === 'Textbereich' ? this.getValidatorsForType(attribute) : [];

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


  private getValidatorsForType(attribute: Attribute): any[] {
    const validators: any[] = [];
    switch (attribute.input_type) {
      case 'Ganzzahlen':
        validators.push(Validators.pattern(/^\d+$/));
        break;
      case 'Dezimalzahlen':
        validators.push(Validators.pattern(/^\d+(,\d+)?$/));
        break;
      case 'Datumfeld':
        validators.push(Validators.pattern(/^\d{4}-\d{2}-\d{2}$/));
        break;
      case 'Link-Feld':
        validators.push(Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/));
        break;
      case 'Boolescher Wert':
        validators.push(Validators.pattern(/^(0|1)$/));
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
        break;
    }
    if (attribute.is_required) {
      validators.push(Validators.required);
    }
    return validators;
  }


  private addControlToFormArray(formArray: FormArray, control: AbstractControl, index?: number): void {
    if (index !== undefined) {
      formArray.insert(index, control);
    } else {
      formArray.push(control);
    }
  }

  private removeControlFromFormArray(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }


  private moveControlInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const control = formArray.at(fromIndex);
    formArray.removeAt(fromIndex);
    formArray.insert(toIndex, control);
  }

  private attributeExistsInGroup(group: Group, attribute: Attribute): boolean {
    return group.attributs.some(attr => attr.id === attribute.id);
  }

  private findOriginalAttribute(attribute: Attribute): Attribute | undefined {
    return this.tariffAttributs.find(attr => attr.id === attribute.id);
  }


  getDropdownOptions(attribute: Attribute) {
    if (attribute.input_type === 'Dropdown' && attribute.details) {
      try {
        const details = JSON.parse(attribute.details);
        return details.options || [];
      } catch (error) {
        console.error('Ошибка парсинга JSON деталей атрибута', error);
        return [];
      }
    }
    return [];
  }

  removeAttribute(group: Group, attribute: Attribute) {
    const index = group.attributs.findIndex(attr => attr.id === attribute.id);
    if (index >= 0) {
      const originalAttribute = this.findOriginalAttribute(attribute);
      if (originalAttribute) {
        originalAttribute.isCopied = false;
        this.productService.deletedTariffAttr.emit(originalAttribute);
      }
      group.attributs.splice(index, 1);

      const groupFormArray = this.getAttributeFormArray(group);
      const formIndex = groupFormArray.controls.findIndex(ctrl => ctrl.value.id === attribute.id);
      if (formIndex >= 0) {
        this.removeControlFromFormArray(groupFormArray, formIndex);
      }
    }
  }

  setFocus(group: Group, index: number) {
    group.attributs[index].isFocused = true;
  }

  removeFocus(group: Group, index: number) {
    group.attributs[index].isFocused = false;
  }


  // canDropToTariffList = (drag: any) => {
  //   return drag.dropContainer.id === this.tariffDropListId;
  // }

  canDropToTariffList = (drag: CdkDrag, drop: CdkDropList) => {
    return drop.id === this.tariffDropListId;
  }


  private loadAttributeGroups() {
    if (this.groupId) {
      // if (this.detailedDataSubscription) {
      //   this.detailedDataSubscription.unsubscribe();
      // }
      this.tariffService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          
          if (response && response.data && response.data.attribute_groups) {
            // Очистим текущие группы и формы
            this.groups = [];
            this.attributeGroupsForm.clear();

            let attributeGroups = JSON.parse(JSON.stringify(response.data.attribute_groups))

            // Проходимся по каждой группе из ответа
            attributeGroups.forEach((group: AttributeGroup) => {
                // Создаем форму для группы
                const copiedAttributes = group.attributs.map(attr => this.copyAttribute(attr));
                
                const groupForm = this.createGroupForm(group.name, group.attributs);
                //const copiedAttribute = this.copyAttribute(group.attributs);
                // Добавляем группу в список
                this.groups.push({
                    id: group.id,
                    name: group.name,
                    attributs: copiedAttributes,
                    form: groupForm
                });
                // Добавляем форму группы в FormArray
                this.attributeGroupsForm.push(groupForm);
            });

            // Обновляем подключенные списки для драг-н-дропа
            this.updateConnectedDropLists();

            // Обновляем статус атрибутов
            this.updateTariffAttributsStatus();
          }
        });
    }
  }

  toggleFrontendVisible(attribute: Attribute, control: any) {
    const isActive = control.get('is_active');

    const newValue = isActive?.value ? 0 : 1;
    attribute.is_frontend_visible = newValue;
    control.get('is_active')?.setValue(newValue);
  }

  private updateTariffAttributsStatus() {
    const copiedAttributeIds = new Set(this.groups.flatMap(group => group.attributs.map(attr => attr.id)));
    this.tariffAttributs.forEach(attribute => {
      attribute.isCopied = copiedAttributeIds.has(attribute.id);
    });
  }

  // Метод для безопасного приведения типов и получения FormArray
  getAttributeFormArray(group: Group): FormArray {
    return group.form.get('attributs') as FormArray;
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

  private generateUniqueIdWithTimestamp(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  
  // Метод для безопасного получения FormControl из FormArray
  getAttributeFormControl(group: FormGroup, index: number, controlName: string): AbstractControl | null {
    return (group.get('attributs') as FormArray).at(index).get(controlName);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}



