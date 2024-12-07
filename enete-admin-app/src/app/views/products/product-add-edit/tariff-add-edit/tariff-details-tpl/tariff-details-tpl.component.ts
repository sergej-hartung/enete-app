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

  copiedAttributsGroup: Set<string | undefined> = new Set();
  AttributsGroupHidden: Set<number> = new Set();

  private subscriptions: Map<number|string, any> = new Map();


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
    this.productService.productMode$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(mode => {
          if(mode == 'edit')  this.loadTariffDetails();
        })

    // Delete Tariff Group
    this.productService.deletedTariffAttrGroup
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(group => {
          const tariffGroup = group?.form.value
          const tariffDetails = this.tariffdetails.value
          if(tariffGroup && tariffGroup.uniqueId){
            const index = tariffDetails.findIndex((item: any) => item.uniqueId == tariffGroup.uniqueId)
            if (index >= 0) {
              this.removeTariffDetailsItem(index)
              this.unsubscribeToFormCanges(tariffGroup.uniqueId)
            }
          }
        })
  }


  private loadTariffDetails() {
    this.tariffService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
            if (response && response.data && response.data.tariffdetails) {
                const detailsFromResponse = response.data.tariffdetails;

                detailsFromResponse.forEach((detail: any) => {
                   

                    let tariffDetail = this.fb.group({
                      id: [detail.id],
                      tariffAttributeGroupId: [detail.tariff_attributeg_groupId],
                      name: [detail.name],
                      uniqueId: [detail?.uniqueId],
                      attributs: this.fb.array(
                        detail.attributs.map((attr:any) => this.createAttributeFormControl(attr))
                      )
                    }); 

                    this.tariffdetails.push(tariffDetail);
                    this.subscribeToFormGroupChanges(detail)         
                    this.copiedAttributsGroup.add(detail?.uniqueId);        
                });

              this.productService.updateTariffLoadedState('tariffDetails', true);
            }
        });
  }

  drop(event: CdkDragDrop<AttributeGroup[]>){
    if (event.previousContainer.id !== this.tariffDropListId){

      const movedItem = event.previousContainer.data[event.previousIndex];
      if(!this.copiedAttributsGroup.has(movedItem.uniqueId)){
        this.tariffdetails.push(this.setTariffDeailsItem(movedItem))

        this.subscribeToFormGroupChanges(movedItem)
        this.copiedAttributsGroup.add(movedItem?.uniqueId);
      }
    }else{
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.moveTariffDetailsInFormArray(event.previousIndex, event.currentIndex);
    }
  }

  subscribeToFormGroupChanges(item: any){
    
    if(item && !this.subscriptions.has(item.uniqueId)){
      const attributGroups = this.attributeGroupsControl

      if(attributGroups){
        const control = attributGroups.controls.find(groupObj => {
          const group = groupObj.value;
          return group && ((group.tariff_attributeg_groupId && item.tariff_attributeg_groupId === group.id) || (group.uniqueId && item.uniqueId === group.uniqueId));
        });
       
        if(control){
          const subscription = control.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((group: AttributeGroup) => {
            if(group && group?.id){
              let tariffDetail = this.getTariffDetailById(group.id)

              if(tariffDetail){
                let attributs = tariffDetail.get('attributs') as FormArray
                attributs.clear()

                tariffDetail.patchValue({
                  tariffAttributeGroupId: group.id,
                  name: group.name,
                  uniqueId: group?.uniqueId,
                })

                let newAttributs = group.attributs.map(attr => this.createAttributeFormControl(attr))

                newAttributs.forEach(elements => {
                  attributs.push(elements)
                })
                
              }
            }else if(group && group?.uniqueId){
              let tariffDetail = this.getTariffDetailByUniqueId(group.uniqueId)
              if(tariffDetail){
                let attributs = tariffDetail.get('attributs') as FormArray
                attributs.clear()

                tariffDetail.patchValue({
                  tariffAttributeGroupId: group.id,
                  name: group.name,
                  uniqueId: group?.uniqueId,
                })

                let newAttributs = group.attributs.map(attr => this.createAttributeFormControl(attr))
                newAttributs.forEach(elements => {
                  attributs.push(elements)
                })
                
              }
            }
          })

          const uniqueId = item.uniqueId

          this.subscriptions.set(uniqueId, subscription);
        }
      }
    }
  }

  moveTariffDetailsInFormArray(previousIndex: number, currentIndex: number) {
    
    const AttrGroupItem = this.tariffdetails.at(previousIndex);
    this.tariffdetails.removeAt(previousIndex);
    this.tariffdetails.insert(currentIndex, AttrGroupItem);
  }

  setTariffDeailsItem(tariffGroup: AttributeGroup){
    return this.fb.group({
      id: [null],
      tariffAttributeGroupId: [tariffGroup.id],
      name: [tariffGroup.name],
      uniqueId: [tariffGroup?.uniqueId],
      attributs: this.fb.array(
        tariffGroup.attributs.map(attr => this.createAttributeFormControl(attr))
      )
    }); 
  }

  removeTariffDetailsItem(index: number){
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

  getTariffDetailById(id: number){
    return this.tariffdetails.controls.find(controlObj => {
      const control = controlObj.value

      if(control && control.tariffAttributeGroupId == id) return true

      return false
    })
  }

  getTariffDetailByUniqueId(uniqueId: string){
    return this.tariffdetails.controls.find(controlObj => {
      const control = controlObj.value

      if(control && control.uniqueId == uniqueId) return true

      return false
    })
  }

  unsubscribeToFormCanges(uniqueId: string){
    if(this.subscriptions.has(uniqueId)){
      const subscription = this.subscriptions.get(uniqueId);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(uniqueId);
      }
    }
    
  }


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


}


