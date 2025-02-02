import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../../../services/form.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SortingService } from '../../../../../services/product/tariff/sorting/sorting.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../../../services/product/product.service';
import { Sorting } from '../../../../../models/tariff/sorting/sorting';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { CalcMatrix, Tariff } from '../../../../../models/tariff/tariff';
import { Attribute } from '../../../../../models/tariff/attribute/attribute';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-tariff-sorting',
  templateUrl: './tariff-sorting.component.html',
  styleUrl: './tariff-sorting.component.scss'
})
export class TariffSortingComponent {

  copiedAttributs: Set<number> = new Set(); // Хранит ID скопированных атрибутов

  tariffForm: FormGroup
  calcMatrixForm: FormArray
  sortingsForm: FormArray

  connectSortings: any = []

  tariffMatrixDropListId = 'tariffMatrixDropList';
  tariffDropListId = 'tariffDropList';

  connectedDropLists: string[] = [];

  hiddenMatrices: boolean = false;
  hiddenGroups: boolean[] = [];

  tariffSortings: any = []

  private unsubscribe$ = new Subject<void>();

  constructor(
      private fb: FormBuilder,
      private formService: FormService,
      private tariffSortingService: SortingService,
      public tariffService: TariffService,
      private productService: ProductService,
    ){
      this.tariffForm = this.formService.getTariffForm()
      //this.tpl = this.tariffForm.get('tpl') as FormArray
      this.calcMatrixForm = this.tariffForm.get('calc_matrix') as FormArray
      this.sortingsForm = this.getTariffSortingForm()
  
    }

  ngOnInit() {
      // this.categoryService.fetchData();
      // this.comboStatusService.fetchData();
  
      

      
      this.productService.tariffGroupId$ 
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(id =>{
          this.tariffSortingService.fetchDataByGroupId(id)
      })

      this.productService.productMode$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(mode => {
          if(mode){

            this.loadData(mode)
          }
        })
  }

  loadData(mode: string){
    
    if(mode == 'new'){
      this.tariffSortingService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(sortingData => {
        if(sortingData && sortingData.entityType == 'tariffSortingsByGroup'){
          this.productService.updateInitTariffDataLoaded('sortings', true);
          this.tariffSortings = sortingData?.data || [];
        }
      })
    }

    if(mode == 'edit'){
      combineLatest([
        this.tariffSortingService.data$,
        this.tariffService.detailedData$
      ])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(([sortingData, tariffData]) => {
          if(sortingData && tariffData && sortingData.entityType == 'tariffSortingsByGroup'){
            this.productService.updateInitTariffDataLoaded('sortings', true);
            console.log('Loaded')

            this.tariffSortings = sortingData?.data || [];
            console.log(this.tariffSortings)
            this.tariffSortings.forEach((sort: Sorting)  => {
              console.log(sort)
              let sorting = this.createSortingFormControl(sort, tariffData.data)
              this.sortingsForm.push(sorting)
            })

            this.updateConnectedDropLists()          
          }
          
        })
    }
    
  }

  createSortingFormControl(sort: Sorting, tariff?: Tariff){
      let sortings = tariff?.sortings
      let sorting = sortings?.find(item => item.criteria_id == sort.id)
      return this.fb.group({
        id: [sorting ? sorting.id : null],
        name: [sorting ? sorting.name : sort.name],
        description: [sorting ? sorting.description : sort.description],
        tariff_id: [tariff?.id],
        sorting_criteria_id: [sorting ? sorting.criteria_id : sort.id],
        value: [sorting ? sorting.value : null, Validators.required],
        include_hardware: [sorting ? sorting.include_hardware : false],
        matrix_uniqueId: [sorting ? sorting.matrix_uniqueId : null],
        attribute_id: [sorting ? sorting.attribute_id: null]
      });
    }

  onToggleMatrices(){
    this.hiddenMatrices = !this.hiddenMatrices
  }

  drop(event: CdkDragDrop<any[]>, control?: any) {
    if (event.previousContainer.id === this.tariffDropListId){
      const attribute = event.previousContainer.data[event.previousIndex];

      if(control){
        // let value = control.value

        // let itemIndex = this.connectSortings.findIndex((item: any) => item.id == value.attribute_id || item.uniqueId == value.matrix_uniqueId)
        // if(itemIndex){
        //   this.connectSortings.splice(itemIndex, 1);
        // }

        control.patchValue({
          attribute_id: attribute.id,
          matrix_uniqueId: null,
          value: attribute.value_varchar
        })

        this.connectSortings.push(attribute)
      }
    }
    if(event.previousContainer.id === this.tariffMatrixDropListId){
      const matrix = event.previousContainer.data[event.previousIndex];

      if(control){
        // let value = control.value

        // let itemIndex = this.connectSortings.findIndex((item: any) => item.id == value.attribute_id || item.uniqueId == value.matrix_uniqueId)
        // if(itemIndex){
        //   this.connectSortings.splice(itemIndex, 1);
        // }

        control.patchValue({
          attribute_id: null,
          matrix_uniqueId: matrix.uniqueId,
          value: matrix.total_value
        })

        this.connectSortings.push(matrix)
      }
    }
    //this.getConnectItem(control)
    console.log(this.connectSortings)
    console.log(event)
  }

  private updateConnectedDropLists() {
    this.connectedDropLists = [
      ...this.sortingsForm.value.map((_: any, index: number) => `sortId-${index}`),
      this.tariffDropListId,
      this.tariffMatrixDropListId,
    ];
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  getTariffSortingForm(): FormArray{
    return (this.tariffForm.get('sortings') as FormArray);
  }

  onToggleGroupVisibility(index: number) {
    this.hiddenGroups[index] = !this.hiddenGroups[index];
  }

  getAttributeGroupArray(): FormArray{
    return (this.tariffForm.get('attribute_groups') as FormArray);
  }

  getAttributeGroupName(index: number): string {
    const attributeGroup = this.getAttributeGroupArray().at(index) as FormGroup;
    return attributeGroup.get('name')?.value;
  }

  getAttributeGroupAttributs(index: number): FormArray {
    const attributeGroup = this.getAttributeGroupArray().at(index) as FormGroup;
    return attributeGroup.get('attributs') as FormArray;
  }

  getConnectItem(control: any){
    let value = control.value
    if(value){
      let item = this.connectSortings.find((item: any) => item.id == value.attribute_id || item.uniqueId == value.matrix_uniqueId)
      return item
    }
    return {}
  }

  ngOnDestroy() {
    console.log('remove')
    this.tariffSortingService.resetData()
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
