import { Component, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AttributeService } from '../../../../../services/product/tariff/attribute/attribute.service';
import { ProductService } from '../../../../../services/product/product.service';
import { AttributeGroupService } from '../../../../../services/product/tariff/attribute-group/attribute-group.service';
import { Subject, delay, of, takeUntil } from 'rxjs';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';
import { MainNavbarService } from '../../../../../services/main-navbar.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditorModalComponent } from '../../../../../shared/components/editor-modal/editor-modal.component'

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
    private modalService: NgbModal
  ) {
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
          // of(null).pipe(
          //   delay(1000)
          // ).subscribe(() => {
          //   this.attributeService.fetchDataByGroupId(this.groupId);
          // });
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

    // this.mainNavbarService.iconClicks$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(button => {
    //     console.log(button)
    //     if (button === 'edit' && this.groupId) {
    //       this.loadAttributeGroups();
    //     }
    //   });

    this.loadAttributeGroups();
  }

  ngOnChanges(changes: SimpleChanges) {   
    this.updateConnectedDropLists();
  }

  setText(){
    console.log('set Text')
  }

  // openEditor(group: Group, index: number) {
  //   const modalRef = this.modalService.open(EditorModalComponent, { size: 'lg' });
  //   const attribute = group.attributes[index];
  //   modalRef.componentInstance.initialValue = attribute?.pivot?.value_text || '';
  //   modalRef.result.then((result: string) => {
  //     console.log(result)
  //     console.log(attribute.pivot)
  //     if (result !== undefined && attribute.pivot) {
  //       const control = (group.form.get('attributes') as FormArray).at(index);
  //       control.patchValue({ value_text: result });
  //       attribute.pivot.value_text = result; // Обновите атрибут в списке
  //       console.log('Сохранено значение:', result);
  //     }
  //   }).catch(() => {});
  // }

  openEditor(group: Group, index: number) {

    const modalRef: NgbModalRef = this.modalService.open(EditorModalComponent, { size: 'lg' });
    const control = (group.form.get('attributes') as FormArray).at(index);
    const attribute = group.attributes[index];
    if(attribute.pivot){
      modalRef.componentInstance.initialValue = attribute.pivot?.value_text || '';
    }else{
      const control = (group.form.get('attributes') as FormArray).at(index);
      modalRef.componentInstance.initialValue = control.get('value_text')?.value || '';
    }
    
    modalRef.componentInstance.saveText.subscribe((result: string) => {
      if (result !== undefined ) {
        //const control = (group.form.get('attributes') as FormArray).at(index);
        control.patchValue({ value_text: result });
        //attribute.pivot.value_text = result;
        console.log('Сохранено значение:', result);
        modalRef.close(); // Закрытие модального окна после сохранения
        console.log(group)
      }
    });
    modalRef.componentInstance.close.subscribe(() => {
      console.log('fenster geschlossen')
      modalRef.close(); // Закрытие модального окна при нажатии на отмену
    });
  }
  // openEditor(group: Group, index: number) {
  //   const modalRef = this.modalService.open(EditorModalComponent, { size: 'lg' });
  //   const attribute = group.attributes[index];
  //   modalRef.componentInstance.initialValue = attribute.value_text || '';
  //   modalRef.result.then((result: string) => {
  //     if (result !== undefined) {
  //       const control = (group.form.get('attributes') as FormArray).at(index);
  //       control.patchValue({ value_text: result });
  //       attribute.value_text = result; // Обновите атрибут в списке
  //     }
  //   }).catch(() => {});
  // }

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
          attributes: this.fb.array([])
        })
      };
      this.groups.push(newGroup);
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
    console.log(this.groups)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.moveItemInFormArray(group!.form.get('attributes') as FormArray, event.previousIndex, event.currentIndex);
    } else {
      if (group) {
        const attribute = event.previousContainer.data[event.previousIndex];
        const attributeExists = group.attributes.some(attr => attr.id === attribute.id);
        if (!attributeExists) {
          const copiedAttribute = { ...attribute, isCopied: true, isFocused: false }; // isFocused по умолчанию false
          group.attributes.splice(event.currentIndex, 0, copiedAttribute);
  
          const originalAttribute = this.tariffAttributes.find(attr => attr.id === attribute.id);
          if (originalAttribute) {
            originalAttribute.isCopied = true;
          }
  
          const groupFormArray = group.form.get('attributes') as FormArray;
          groupFormArray.insert(event.currentIndex, this.fb.group({
            id: [attribute.id],
            code: [attribute.code],
            name: [attribute.name],
            value_varchar: [null],
            value_text: [null],
            is_active: [attribute.is_frontend_visible]
          }));
        }
      }
    }
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
    console.log(attribute);
    const index = group.attributes.indexOf(attribute);
    if (index >= 0) {
      const originalAttribute = this.tariffAttributes.find(attr => attr.code === attribute.code);
      if (originalAttribute) {
        originalAttribute.isCopied = false;
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
      this.attributeGroupService.data$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          if(response){
            const groupsFromServer = response.data; // Здесь ваши группы из ответа сервера

            this.groups = groupsFromServer.map(group => ({
              id: group.id,
              name: group.name,
              attributes: group.attributs.map(attr => ({
                ...attr,
                isCopied: true // Отметьте атрибуты как скопированные
              })),
              hidden: false,
              form: this.fb.group({
                attributes: this.fb.array(
                  group.attributs.map(attr => this.fb.group({
                    id: [attr.id],
                    code: [attr.code],
                    name: [attr.name],
                    value_varchar: [attr?.pivot?.value_varchar || ''],
                    value_text: [attr?.pivot?.value_text || ''],
                    is_active: [attr?.pivot?.is_active]
                  }))
                )
              })
            }));

            this.updateTariffAttributesStatus();
            this.updateConnectedDropLists();
            console.log('Loaded Groups:', this.groups);
          }       
        });
    }
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}



