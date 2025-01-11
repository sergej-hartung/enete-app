import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../../../../services/form.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SortingService } from '../../../../../services/product/tariff/sorting/sorting.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../../../services/product/product.service';
import { Sorting } from '../../../../../models/tariff/sorting/sorting';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';

@Component({
  selector: 'app-tariff-sorting',
  templateUrl: './tariff-sorting.component.html',
  styleUrl: './tariff-sorting.component.scss'
})
export class TariffSortingComponent {

  copiedAttributs: Set<number> = new Set(); // Хранит ID скопированных атрибутов

  tariffForm: FormGroup
  calcMatrixForm: FormArray

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
      private tariffSortingrService: SortingService,
      public tariffService: TariffService,
      private productService: ProductService,
    ){
      this.tariffForm = this.formService.getTariffForm()
      //this.tpl = this.tariffForm.get('tpl') as FormArray
      this.calcMatrixForm = this.tariffForm.get('calc_matrix') as FormArray
  
    }

  ngOnInit() {
      // this.categoryService.fetchData();
      // this.comboStatusService.fetchData();
  
      

      
      this.productService.tariffGroupId$ 
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(id =>{
          this.tariffSortingrService.fetchDataByGroupId(id)
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
      this.tariffSortingrService.data$
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
        this.tariffSortingrService.data$,
        this.tariffService.detailedData$
      ])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(([sorting, tariff]) => {
          if(sorting && tariff){
            this.productService.updateInitTariffDataLoaded('sortings', true);
            console.log('Loaded')
            console.log(sorting)
            console.log(tariff)
          }
          
        })
    }

    

      
    
  }

  createSortingFormControl(sort: Sorting){
      return this.fb.group({
        id: [sort.id],
        tariff_id: [sort.name],
        sorting_criteria_id: [sort.id],
        value: [],
        include_hardware: [false],
      });
    }

  onToggleMatrices(){
    this.hiddenMatrices = !this.hiddenMatrices
  }

  drop(event: CdkDragDrop<any[]>, control?: any) {

  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
