import { Component } from '@angular/core';
import { combineLatest, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ProviderService } from '../../../../../services/product/tariff/provider/provider.service';
import { NetworkOperatorService } from '../../../../../services/product/tariff/network-operator/network-operator.service';
import { StatusService } from '../../../../../services/product/tariff/status/status.service';
import { FormService } from '../../../../../services/form.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../../../../services/product/product.service';
import { CategoryService } from '../../../../../services/product/tariff/category/category.service';
import { Category } from '../../../../../models/tariff/category/category';
import { ComboStatusService } from '../../../../../services/product/tariff/combo-status/combo-status.service';
import { ComboStatus } from '../../../../../models/tariff/comboStatus/comboStatus';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { DataResponse } from '../../../../../models/data-interface';
import { Tariff } from '../../../../../models/tariff/tariff';

@Component({
  selector: 'app-tariff-details-a-e',
  templateUrl: './tariff-details-a-e.component.html',
  styleUrl: './tariff-details-a-e.component.scss'
})
export class TariffDetailsAEComponent {
  
  combiHardware: ComboStatus[] | [] = [
    // { id: 1, label: 'ohne Hardware', checked: false },
    // { id: 2, label: 'mit Hardware', checked: false },
  ];
  tariffCategories: Category[] | [] = [
    // { id: 1, label: 'Privat', checked: false },
    // { id: 2, label: 'Business', checked: false },
    // { id: 3, label: 'Jungeleute', checked: false },
    // { id: 4, label: 'VVL', checked: false },
  ];
  tariffForm: FormGroup
  tariffFormGroup: FormGroup
  tariffStatuses: any = []
  tariffProviders: any = []
  tariffNetworkOperators: any = []

  private unsubscribe$ = new Subject<void>();

  constructor(
    private tariffStatusService: StatusService,
    private tariffProviderService: ProviderService,
    private tariffNetworkOperatorService: NetworkOperatorService,
    private categoryService: CategoryService,
    private comboStatusService: ComboStatusService,
    private productService: ProductService,
    public tariffService: TariffService,
    private formService: FormService,
    private fb: FormBuilder
  ) {
    // this.tariffFormGroup = this.formService.initTariffFormGroup()
    this.tariffForm = this.formService.getTariffForm()
    this.tariffFormGroup = this.tariffForm.get('tariff') as FormGroup
  }

  ngOnInit() {
       this.categoryService.fetchData()
       this.comboStatusService.fetchData()

      combineLatest([
        this.categoryService.data$,
        this.comboStatusService.data$,
        this.tariffStatusService.data$,
        this.tariffProviderService.data$,
        this.tariffNetworkOperatorService.data$
      ])
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(([categoriesData, comboStatusData, statusesData, providersData, networkOperatorsData]) => {
          console.log('test5')
          this.tariffCategories = categoriesData?.data || [];
          this.combiHardware = comboStatusData?.data || [];
          this.tariffStatuses = statusesData?.data || [];
          this.tariffProviders = providersData?.data || [];
          this.tariffNetworkOperators = networkOperatorsData?.data || [];
  
          this.setCategoriesFormArray();
          this.setHardwareComboFormArray();
  
          return this.productService.productMode$;
        }),
        switchMap(mode => {
          if (mode === 'edit') {
            return this.tariffService.detailedData$;
          } else if (mode === 'new') {
            return this.productService.tariffGroupId$;
          } else {
            return of(null); // Возвращаем null если режим не соответствует
          }
        })
      )
      .subscribe(result => {
        if (result && this.isDataResponse(result) && result.entityType === 'Tariff') {
          this.loadTariff(result as DataResponse<Tariff>);
        } else if (typeof result === 'number') {
          this.setTariffGroup(result);
        }
      });

  }

  isDataResponse(result: any): result is DataResponse<Tariff> {
    return result && typeof result === 'object' && 'entityType' in result;
  }

  setHardwareComboFormArray() {
    const hardwareComboArray = this.tariffForm.get('combo_status') as FormArray;
    this.combiHardware.forEach(option => {
      if(hardwareComboArray){
        hardwareComboArray.push(this.fb.group({
          id: [option.id],
          name: [option.name],
          checked: [option.checked || false]
        }));
      }
    });
  }

  setCategoriesFormArray() {
    console.log('set categorie')
    const categoriesArray = this.tariffForm.get('categories') as FormArray;
    this.tariffCategories.forEach(option => {
      if(categoriesArray){
        categoriesArray.push(this.fb.group({
          id: [option.id],
          name: [option.name],
          checked: [option.checked || false]
        }));
      }
    });
  }

  test(){
    console.log(this.formService.getTariffForm())
    console.log((this.tariffForm.get('combo_status') as FormArray).controls)
  }

  loadTariff(tariffData: DataResponse<any>) {
    this.tariffFormGroup.patchValue(tariffData.data);
    this.patchComboStatus(tariffData.data.combo_status);
    //this.patchCategories(tariffData.data.tariff_categories);

    let status = tariffData.data.status;
    let provider = tariffData.data.provider;
    let network_operator = tariffData.data.network_operator;

    this.tariffFormGroup.patchValue({
      status_id: status?.id,
      provider_id: provider?.id,
      network_operator_id: network_operator?.id
    });
  }

  patchComboStatus(comboStatus: ComboStatus[] | undefined) {
    //console.log(comboStatus)
    if(comboStatus && comboStatus.length > 0){
      const hardwareComboArray = this.tariffForm.get('combo_status') as FormArray;
      comboStatus.forEach(status => {
        // console.log(status.id)
        // console.log(this.tariffForm.get('combo_status'))
        // console.log(hardwareComboArray.controls.find(ctrl => ctrl.value.id === status.id))
        const control = hardwareComboArray.controls.find(ctrl => ctrl.value.id === status.id);
        if (control) {
          control.patchValue({ checked: true });
        }
      });
    }
  }

  setTariffGroup(groupId: number) {
    if (groupId) {
      this.tariffFormGroup.get('group_id')?.setValue(groupId);
    }
  }

  updateSelectedItems() {
    this.combiHardware = this.combiHardware.map(option => {
      option.checked = !!option.checked;
      return option;
    });
    this.tariffCategories = this.tariffCategories.map(option => {
      option.checked = !!option.checked;
      return option;
    });
  } 

  get comboStatus(): FormArray {
    return this.tariffForm.get('combo_status') as FormArray;
  }

  get categories(): FormArray {
    return this.tariffForm.get('categories') as FormArray;
  }

  get selectedCombiHardware() {
    return this.combiHardware.filter(option => option.checked);
  }

  get selectedTariffCategories() {
    return this.tariffCategories.filter(option => option.checked);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
