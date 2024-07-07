import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProviderService } from '../../../../../services/product/tariff/provider/provider.service';
import { NetworkOperatorService } from '../../../../../services/product/tariff/network-operator/network-operator.service';
import { StatusService } from '../../../../../services/product/tariff/status/status.service';
import { FormService } from '../../../../../services/form.service';
import { FormGroup } from '@angular/forms';
import { ProductService } from '../../../../../services/product/product.service';
import { CategoryService } from '../../../../../services/product/tariff/category/category.service';
import { Category } from '../../../../../models/tariff/category/category';

@Component({
  selector: 'app-tariff-details-a-e',
  templateUrl: './tariff-details-a-e.component.html',
  styleUrl: './tariff-details-a-e.component.scss'
})
export class TariffDetailsAEComponent {
  
  combiHardware = [
    { id: 1, label: 'ohne Hardware', checked: false },
    { id: 2, label: 'mit Hardware', checked: false },
  ];
  tariffCategories: Category[] | [] = [
    // { id: 1, label: 'Privat', checked: false },
    // { id: 2, label: 'Business', checked: false },
    // { id: 3, label: 'Jungeleute', checked: false },
    // { id: 4, label: 'VVL', checked: false },
  ];

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
    private productService: ProductService,
    private formService: FormService
  ) {
    // this.tariffFormGroup = this.formService.initTariffFormGroup()
    let tariffForm = this.formService.getTariffForm()
    this.tariffFormGroup = tariffForm.get('tariff') as FormGroup
  }

  ngOnInit() {
      this.categoryService.fetchData()

      this.tariffStatusService.data$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => { 
          if(data && data["data"]){
            this.tariffStatuses =  data.data
          }else{
            this.tariffStatuses = []
          }   
      });

      this.categoryService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data && data["data"]){
          this.tariffCategories =  data.data
        }else{
          this.tariffCategories = []
        }   
      });

      this.tariffProviderService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data && data["data"]){
          this.tariffProviders =  data.data
        }else{
          this.tariffProviders = []
        }   
      });

      this.tariffNetworkOperatorService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data && data["data"]){
          this.tariffNetworkOperators =  data.data
        }else{
          this.tariffNetworkOperators = []
        }   
      });

      
      this.productService.productMode$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(mode => {
          if(mode == 'edit')  this.loadTariff();

          if(mode == 'new')  this.setTariffGroup();
        })

  }

  test(){
    console.log(this.formService.getTariffForm())
  }

  loadTariff(){
    this.productService.selectedTarif$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(tariff =>{
        this.tariffFormGroup.patchValue(tariff)
        console.log(tariff)
        let status = tariff?.status
        let provider = tariff?.provider
        let network_operator = tariff?.network_operator
        this.tariffFormGroup.patchValue({status_id: status?.id})
        this.tariffFormGroup.patchValue({provider_id: provider?.id})
        this.tariffFormGroup.patchValue({network_operator_id: network_operator?.id})
      })
    
  }

  setTariffGroup(){
    this.productService.tariffGroupId$ 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id =>{
        if(id){
          this.tariffFormGroup.get('group_id')?.setValue(id)
        }
      })
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
