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


  tariffMatrixDropListId = 'tariffMatrixDropList';
  tariffDropListId = 'tariffDropList';

  connectedDropLists: string[] = [];

  hiddenMatrices: boolean = false;
  hiddenGroups: boolean[] = [];

  tariffSortings: any = []

  private unsubscribe$ = new Subject<void>();
  private subscriptions: Map<number|string, any> = new Map();

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

    this.productService.deletedTariffAttr
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(attr => {
        const sorting = this.getSortingByAttrId(attr.id)
        if(sorting){
          this.removeSorting(sorting)
        }
      })

    this.productService.deletedTariffAttrGroup
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(group => {
        if(group && 'attributs' in group){
          group.attributs.forEach((attr: any) => {
            const sorting = this.getSortingByAttrId(attr.id)
            if(sorting){
              this.removeSorting(sorting)
            }
          })
        }
      })
    
      this.productService.deletedTariffMatrix
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(matrixObj => {
          const matrix = matrixObj?.form.value
          //console.log(matrix)
          if(matrix && matrix.uniqueId){
            const sorting = this.getSortingByMatrixUniqueId(matrix.uniqueId)
            if(sorting){
              this.removeSorting(sorting)
            }
          }
      })

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

          this.tariffSortings.forEach((sort: Sorting)  => {
            let sorting = this.createSortingFormControl(sort)
            this.sortingsForm.push(sorting)
          })
          this.updateConnectedDropLists()  
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
            //this.productService.updateInitTariffDataLoaded('sortings', true);
            console.log('Loaded')

            this.tariffSortings = sortingData?.data || [];

            let newSortings:any = []

            this.tariffSortings.forEach((sort: Sorting)  => {
              console.log(tariffData.data)
              let sorting = this.createSortingFormControl(sort, tariffData.data)

              if(sorting.get('id')?.value){
                this.sortingsForm.push(sorting)
              }else{
                newSortings.push(sorting)
              }
            })
            console.log(this.sortingsForm)
                 
            
            this.productService.updateInitTariffDataLoaded('sortings', true);
            newSortings.forEach((sorting:any) => {
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
      let matrixName = null
      let attributName = null
      let unit = null
      console.log(sortings)
      if(sorting?.matrix_uniqueId){
        let calcMatrixArr = this.calcMatrixForm.value
        if(calcMatrixArr){
          calcMatrixArr.forEach((matrix:any) => {
            if(matrix.uniqueId == sorting?.matrix_uniqueId){
              matrixName = matrix.name
              unit = matrix.unit
            }
          })
        }
      }

      if(sorting?.attribute_id){
        let attrGroupArr = this.getAttributeGroupArray().value
        attrGroupArr.forEach((group: any) => {
          if(group?.attributs){
            group.attributs.forEach((attribut:any) => {
              if(attribut.id ==  sorting?.attribute_id){
                attributName = attribut.name
                unit = attribut.unit
                this.copiedAttributs.add(attribut.id);
              }
            })
          }
        })
      }

      let form = this.fb.group({
        id: [sorting ? sorting.id : null],
        //uniqueId: [sorting ? null : this.generateUniqueIdWithTimestamp()],
        name: [sorting ? sorting.name : sort.name],
        description: [sorting ? sorting.description : sort.description],
        tariff_id: [tariff?.id],
        sorting_criteria_id: [sorting ? sorting.criteria_id : sort.id],
        value: [sorting ? sorting.value : null, Validators.required],
        include_hardware: [sorting ? sorting.include_hardware : false],
        matrix_uniqueId: [sorting ? sorting.matrix_uniqueId : null],
        matrix_name: [matrixName ? matrixName : null],
        attribute_id: [sorting ? sorting.attribute_id: null],
        attribute_name: [attributName ? attributName: null],
        unit: [unit ? unit : null]
      });

      if(sorting?.attribute_id){
        this.subscribeToFormChanges(sorting.attribute_id, form)
      }

      if(sorting?.matrix_uniqueId){
        this.subscribeToMatrixChanges(sorting?.matrix_uniqueId, form)
      }
      

      return form
    }

  onToggleMatrices(){
    this.hiddenMatrices = !this.hiddenMatrices
  }

  drop(event: CdkDragDrop<any[]>, control?: any) {
    if (event.previousContainer.id === this.tariffDropListId){
      const attribute = event.previousContainer.data[event.previousIndex];

      if(control){
        control.patchValue({
          attribute_id: attribute.id,
          matrix_uniqueId: null,
          value: parseFloat(attribute.value_varchar.replace(",", ".")),
          attribute_name: attribute.name,
          matrix_name: null,
          include_hardware: false,
          unit: attribute.unit
        })
        console.log(control)
        this.subscribeToFormChanges(attribute.id, control)
        this.copiedAttributs.add(attribute.id);
      }
    }
    if(event.previousContainer.id === this.tariffMatrixDropListId){
      const matrix = event.previousContainer.data[event.previousIndex];

      if(control){
        control.patchValue({
          attribute_id: null,
          matrix_uniqueId: matrix.uniqueId,
          matrix_name: matrix.name,
          attribute_name: null,
          include_hardware: matrix.hardware_charge,
          value: matrix.total_value,
          unit: matrix.unit
        })
        this.subscribeToMatrixChanges(matrix.uniqueId, control)
      }
    }

    console.log(this.tariffForm)
  }

  private updateConnectedDropLists() {
    this.connectedDropLists = [
      ...this.sortingsForm.value.map((_: any, index: number) => `sortId-${index}`),
      this.tariffDropListId,
      this.tariffMatrixDropListId,
    ];
  }

  removeSorting(control: any){
    let value = control.value
    control.patchValue({
      attribute_id: null,
      attribute_name: null,
      //id: null,
      include_hardware: false,
      matrix_name: null,
      matrix_uniqueId: null,
      unit: null,
      value: null
    })
    
    if(value?.attribute_id){
      this.copiedAttributs.delete(value?.attribute_id);
      this.unsubscribeToFormCanges(value?.attribute_id)
    }else if(value.matrix_uniqueId){
      this.unsubscribeToFormCanges(value.matrix_uniqueId)
    }
  }

  subscribeToFormChanges(id: number, control: FormGroup){
    if(id && !this.subscriptions.has(id)){
      let tariffForm = this.getAttributeGroupArray()
      
      tariffForm.controls.forEach((formGroup) => {
        const attributs = formGroup.value?.attributs || [];

        const attrIndex = attributs.findIndex((attribute: any) => attribute.id === id);

        if (attrIndex > -1) {

          const attributsArr = formGroup.get('attributs') as FormArray
          const attrControl = attributsArr?.at(attrIndex)
          if(attrControl){
            
              const subscription = attrControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(attr => {
                control.patchValue({
                  attribute_id: attr.id,
                  matrix_uniqueId: null,
                  value: parseFloat(attr.value_varchar.replace(",", ".")),
                  attribute_name: attr.name,
                  matrix_name: null,
                  include_hardware: false,
                  unit: attr.unit
                })
              })
              this.subscriptions.set(id, subscription);
          }
        }
      });
    }
  }

  subscribeToMatrixChanges(uniqueId: string, control: FormGroup){
    if(uniqueId && !this.subscriptions.has(uniqueId)){
      const matrices = this.calcMatrixForm.value
      const matrixIndex = matrices.findIndex((matrix: any) => matrix.uniqueId == uniqueId)

      if(matrixIndex > -1){
        const matrixControl = this.calcMatrixForm.at(matrixIndex)
        const subscription = matrixControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(matrix => {
          control.patchValue({
            attribute_id: null,
            matrix_uniqueId: matrix.uniqueId,
            matrix_name: matrix.name,
            attribute_name: null,
            include_hardware: matrix.hardware_charge,
            value: matrix.total_value,
            unit: matrix.unit
          })
        })
        this.subscriptions.set(uniqueId, subscription);
      }
      
    }
  }

  unsubscribeToFormCanges(id: string | number){
    if(this.subscriptions.has(id)){
      const subscription = this.subscriptions.get(id);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(id);
      }
    }
    
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  getTariffSortingForm(): FormArray{
    return (this.tariffForm.get('sortings') as FormArray);
  }

  getSortingByAttrId(AttrId: number){
    return this.sortingsForm.controls.find(control => control?.value?.attribute_id == AttrId)
  }

  getSortingByMatrixUniqueId(uniqueId: number){
    return this.sortingsForm.controls.find(control => control?.value?.matrix_uniqueId == uniqueId)
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

  private generateUniqueIdWithTimestamp(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }


  ngOnDestroy() {
    console.log('remove')
    this.tariffSortingService.resetData()
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
