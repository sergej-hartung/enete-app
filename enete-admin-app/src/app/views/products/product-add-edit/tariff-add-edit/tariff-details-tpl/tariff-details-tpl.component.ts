import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../../../../services/form.service';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { ProductService } from '../../../../../services/product/product.service';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { AttributeGroup } from '../../../../../models/tariff/attributeGroup/attributeGroup';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';


@Component({
  selector: 'app-tariff-details-tpl',
  templateUrl: './tariff-details-tpl.component.html',
  styleUrl: './tariff-details-tpl.component.scss'
})
export class TariffDetailsTplComponent {

  tariffForm: FormGroup
  tariffDropListId = 'tariffDetailsDropList';
  tariffGroupDropListId = 'tariffDetailsGroupId'
  connectedDropLists: string[] = [this.tariffDropListId, this.tariffGroupDropListId];
  tariffdetails: FormArray

  private unsubscribe$ = new Subject<void>();

  copiedAttributsGroup: Set<number> = new Set();
  AttributsGroupHidden: Set<number> = new Set();


  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    public tariffService: TariffService,
    private productService: ProductService,
  ){
    this.tariffForm = this.formService.getTariffForm()
    this.tariffdetails = this.tariffForm.get('tariffdetails') as FormArray
  }

  ngOnInit() {
    // this.updateConnectedDropLists();

    // this.attributeGroupsControl.valueChanges
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(() => {
    //     this.updateConnectedDropLists();
    //   });
  }

  drop(event: CdkDragDrop<AttributeGroup[]>){
    if (event.previousContainer.id !== this.tariffDropListId){
      console.log(event)
      const movedItem = event.previousContainer.data[event.previousIndex];
      this.tariffdetails.push(this.setTariffDeailsItem(movedItem))
      console.log(this.setTariffDeailsItem(movedItem))
      console.log(this.tariffdetails)
    }else{
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.moveTariffDetailsInFormArray(event.previousIndex, event.currentIndex);
    }
  }

  moveTariffDetailsInFormArray(previousIndex: number, currentIndex: number) {
    
    const AttrGroupItem = this.tariffdetails.at(previousIndex);
    this.tariffdetails.removeAt(previousIndex);
    this.tariffdetails.insert(currentIndex, AttrGroupItem);
  }

  setTariffDeailsItem(tariffGroup: AttributeGroup){
    console.log(tariffGroup)
    return this.fb.group({
      id: [tariffGroup.id],
      name: [tariffGroup.name],
      uniqueId: [tariffGroup?.uniqueId],
      attributs: this.fb.array(
        tariffGroup.attributs.map(attr => this.createAttributeFormControl(attr))
      )
    }); 
  }

  removeTariffDetailsItem(item: any, index: number){
    if (index >= 0) {
      this.tariffdetails.removeAt(index)
    }
  }

  createAttributeFormControl(attr: Attribute){
    return this.fb.group({
      id: [attr.id],
      code: [attr.code],
      name: [attr.name],
      unit: [attr.unit],
      value_varchar: [attr?.value_varchar],
      value_text: [attr?.value_text],
      is_active: [attr?.is_active]
    });
  }

  onToggleAttrGroup(index: number){
    if(this.AttributsGroupHidden.has(index)){
      this.AttributsGroupHidden.delete(index)
    }else{
      this.AttributsGroupHidden.add(index)
    }
    
  }

  // updateConnectedDropLists() {
  //   // Генерация списка идентификаторов правых контейнеров
  //   const rightDropLists = this.attributeGroupsControl.controls.map((_, i: number) => this.onGetTariffdetailsDropListId(i));
    
  //   // Объединяем левый контейнер с правыми
  //   this.connectedDropLists = [this.tariffDropListId, ...rightDropLists];
  // }

  // onGetTariffdetailsDropListId(): string {
  //   return `tariffDetailsGroupId`;
  // }


  get attributeGroupsControl() {
    return this.tariffForm.get('attribute_groups') as FormArray;
  }

  getTariffDetailsAttributs(item: any){
    return item.get('attributs') as FormArray
  }

  getAttributeGroupName(index: number): string {
    const attributeGroup = this.attributeGroupsControl.at(index) as FormGroup;
    return attributeGroup.get('name')?.value;
  }

  getAttributeGroupAttributs(index: number): FormArray {
    const attributeGroup = this.attributeGroupsControl.at(index) as FormGroup;
    return attributeGroup.get('attributs') as FormArray;
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logEvent(event: CdkDragDrop<any[]>) {
    console.log('Drop Event Triggered:', event);
  }
}


