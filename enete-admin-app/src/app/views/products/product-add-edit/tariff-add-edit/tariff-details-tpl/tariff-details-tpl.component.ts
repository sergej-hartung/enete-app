import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../../../../services/form.service';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { ProductService } from '../../../../../services/product/product.service';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-tariff-details-tpl',
  templateUrl: './tariff-details-tpl.component.html',
  styleUrl: './tariff-details-tpl.component.scss'
})
export class TariffDetailsTplComponent {

  tariffForm: FormGroup
  tariffDropListId = 'tariffDropList';
  connectedDropLists: string[] = [this.tariffDropListId];
  rightDropLists: string[] = [];
  tariffdetails: FormArray


  private unsubscribe$ = new Subject<void>();


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
    this.updateConnectedDropLists();

    this.attributeGroupsControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateConnectedDropLists();
      });
  }

  drop(event: CdkDragDrop<any[]>){
    console.log('Drop Event: ', event);
    console.log('Previous container data: ', event.previousContainer.data);
    console.log('Current container data: ', event.container.data);
    console.log('right List: ', this.rightDropLists);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.container.id === this.tariffDropListId) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.tariffForm.get('tariffdetails')?.setValue(this.tariffdetails.value);

      const previousIndex = +event.previousContainer.id.split('-')[1];
      this.attributeGroupsControl.at(previousIndex)?.get('attributes')?.setValue(event.previousContainer.data);
    }

    console.log('Updated Left Block Data: ', this.tariffdetails.value);
    console.log('Updated Right Block Data: ', this.attributeGroupsControl.value);
  }

  updateConnectedDropLists() {
    // Генерация списка идентификаторов правых контейнеров
    this.rightDropLists = this.attributeGroupsControl.controls.map((_, i: number) => this.onGetTariffdetailsDropListId(i));
    
    // Объединяем левый контейнер с правыми
    this.connectedDropLists = [this.tariffDropListId, ...this.rightDropLists];
    
    console.log('Connected Drop Lists: ', this.connectedDropLists);
  }

  onGetTariffdetailsDropListId(index: number): string {
    return `tariffdetailsDropList-${index}`;
  }


  get attributeGroupsControl() {
    return this.tariffForm.get('attribute_groups') as FormArray;
  }

  getAttributeGroupName(index: number): string {
    const attributeGroup = this.attributeGroupsControl.at(index) as FormGroup;
    return attributeGroup.get('name')?.value;
  }

  getAttributeGroupAttributes(index: number): FormArray {
    const attributeGroup = this.attributeGroupsControl.at(index) as FormGroup;
    return attributeGroup.get('attributes') as FormArray;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
