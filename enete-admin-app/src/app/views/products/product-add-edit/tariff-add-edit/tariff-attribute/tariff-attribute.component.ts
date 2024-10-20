import { Component, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AttributeService } from '../../../../../services/product/tariff/attribute/attribute.service';
import { ProductService } from '../../../../../services/product/product.service';
import { AttributeGroupService } from '../../../../../services/product/tariff/attribute-group/attribute-group.service';
import { Observable, Subject, delay, of, takeUntil } from 'rxjs';
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
  attributs: Attribute[];
  form: FormGroup; // Убедимся, что form всегда определяется как FormGroup
  hidden?: boolean;
}

@Component({
  selector: 'app-tariff-attribute',
  templateUrl: './tariff-attribute.component.html',
  styleUrls: ['./tariff-attribute.component.scss']
})
export class TariffAttributeComponent {
  tariffAttributs: Attribute[] = [];
  groups: Group[] = [];
  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId];
  attributeGroupsForm: FormArray;

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
    const tariffForm = this.formService.getTariffForm();
    this.attributeGroupsForm = tariffForm.get('attribute_groups') as FormArray;

    this.newGroupForm = this.fb.group({
      groupName: ['', Validators.required]
    });

    this.editGroupForm = this.fb.group({
      groupName: ['', Validators.required]
    });
  }

  ngOnInit() { 
    this.subscribeWithUnsubscribe(this.productService.tariffGroupId$, id => {
      if (id && this.groupId !== id) {
        this.groupId = id;
        this.attributeService.fetchDataByGroupId(this.groupId);
      }
    });

    this.subscribeWithUnsubscribe(this.attributeService.data$, data => {
      if (data && data.entityType === 'tariffAttributsByGroup') {
        this.tariffAttributs = data.data;
        this.updateTariffAttributsStatus();
      }
    });

    this.subscribeWithUnsubscribe(this.productService.productMode$, mode => {
      if (mode === 'edit') this.loadAttributeGroups();
    });
  }

  ngOnChanges(changes: SimpleChanges) {   
    this.updateConnectedDropLists();
  }

  private subscribeWithUnsubscribe<T>(observable: Observable<T>, callback: (value: T) => void): void {
    observable.pipe(takeUntil(this.unsubscribe$)).subscribe(callback);
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

    modalRef.componentInstance.saveText.pipe(takeUntil(this.unsubscribe$)).subscribe((result: any) => {
      if (result !== undefined) {
        control.patchValue({ value_text: result });
        markAsTouchedAndClose();
      }
    });

    modalRef.componentInstance.close.pipe(takeUntil(this.unsubscribe$)).subscribe(markAsTouchedAndClose);
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
        // form: this.fb.group({
        //   id: [null],
        //   name: [this.newGroupForm.value.groupName],
        //   attributes: this.fb.array([])
        // })
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
    return { 
      ...attribute, 
      isCopied: true, 
      isFocused: false, 
      isActiveDesibled: !attribute.is_frontend_visible 
    };
  }

  private createGroupForm(name: string, attributs: Attribute[] = []): FormGroup {
    return this.fb.group({
      id: [null],
      name: [name],
      uniqueId: [this.generateUniqueIdWithTimestamp()],
      attributs: this.fb.array(
        attributs.map(attr => this.createAttributeFormControl(attr))
      )
    });
  }

 

  private createAttributeFormControl(attribute: Attribute, valueVarchar: string = '', valueText: string = '', isActive: number | null = null): FormGroup {
    const valueVarcharValidators = attribute.input_type != 'Textbereich' ? this.getValidatorsForType(attribute, valueVarchar) : '';
    const valueTextValidators = attribute.input_type == 'Textbereich'? this.getValidatorsForType(attribute, valueText) : '';
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

  private getValidatorsForType(attribute: Attribute, value: string): any[] {
    const validators:any = [];   
      switch (attribute.input_type) {
        case 'Ganzzahlen':
          validators.push(Validators.pattern(/^\d+$/)); // Только целые числа
          this.setRequired(attribute, validators)
          break;
        case 'Dezimalzahlen':
          validators.push(Validators.pattern(/^\d+(,\d+)?$/)); // Десятичные числа
          this.setRequired(attribute, validators)
          break;
        case 'Datumfeld':
          validators.push(Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)); // Дата в формате ГГГГ-ММ-ДД
          this.setRequired(attribute, validators)
          break;
        case 'Link-Feld':
          validators.push(Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)); // URL
          this.setRequired(attribute, validators)
          break;
        case 'Boolescher Wert':
          validators.push(Validators.pattern(/^(0|1)$/)); // Булевый (0 или 1)
          this.setRequired(attribute, validators)
          break;
          case 'Dateifeld':
            // Для поля файла можно добавить валидатор на допустимые расширения файлов, если нужно
            this.setRequired(attribute, validators)
            break;
        case 'Dropdown':
            // Для выпадающего списка специфические валидаторы не нужны
            this.setRequired(attribute, validators)
            break;
        case 'Mehrfachauswahl':
            // Для множественного выбора специфические валидаторы не нужны
            this.setRequired(attribute, validators)
            break;
        case 'Textfeld':
            // Для текстового поля специфические валидаторы не нужны
            this.setRequired(attribute, validators)
            break;
        case 'Textbereich':
            // Валидаторы добавлены выше
            this.setRequired(attribute, validators)
            break;
        default:
            // Для других типов данных добавьте свои валидаторы, если необходимо
            break;
      }


    return validators;
  }

  private setRequired(attribute: any, validators: any){
    if (attribute.is_required) {
      validators.push(Validators.required);
    }
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
    formArray.removeAt(fromIndex, {emitEvent:false});
    formArray.insert(toIndex, control);
  }

  private attributeExistsInGroup(group: Group, attribute: Attribute): boolean {
    return group.attributs.some(attr => attr.id === attribute.id);
  }

  private findOriginalAttribute(attribute: Attribute): Attribute | undefined {
    return this.tariffAttributs.find(attr => attr.id === attribute.id);
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
    const index = group.attributs.indexOf(attribute);
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


  canDropToTariffList = (drag: any) => {
    return drag.dropContainer.id === this.tariffDropListId;
  }



  private loadAttributeGroups() {
    if (this.groupId) {
      this.tariffService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          if (response) {
            const groupsFromTariff = response?.data?.attribute_groups;
            if (groupsFromTariff) {
              this.groups = groupsFromTariff.map(group => ({
                id: group.id,
                name: group.name,
                attributs: group.attributs.map(attr => ({
                  ...attr,
                  isCopied: true,
                  ...(attr?.is_frontend_visible === 0 || attr?.is_frontend_visible === false ? { isActiveDesibled: true } : {})
                })),
                hidden: false,
                form: this.fb.group({
                    id: [group.id],
                    name: [group.name],
                    attributs: this.fb.array(
                      group.attributs.map(attr => this.createAttributeFormControl(
                        attr, attr?.pivot?.value_varchar || '', 
                        attr?.pivot?.value_text || '', 
                        attr?.pivot?.is_active
                      ))
                    )
                  })
              }));

              this.attributeGroupsForm.clear();
              this.groups.forEach(group => {
                this.attributeGroupsForm.push(group.form);
              });

              this.updateTariffAttributsStatus();
              this.updateConnectedDropLists();
            }
          }
        });
    }
  }

  toggleFrontendVisible(attribute: Attribute, control: any) {
    const isActive = control.get('is_active');

    attribute.is_frontend_visible = isActive?.value ? 0 : 1;
    control.get('is_active')?.setValue(isActive?.value ? 0 : 1);
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



