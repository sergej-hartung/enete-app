import { Component } from '@angular/core';
import { Tablecolumn } from '../../../../models/tablecolumn';
import { FilterOption } from '../../../../shared/components/generic-table/generic-table.component';
import { NetworkOperator } from '../../../../models/tariff/network-operator/network-operator';
import { Provider } from '../../../../models/tariff/provider/provider';
import { Subject, takeUntil } from 'rxjs';
import { TariffService } from '../../../../services/product/tariff/tariff.service';
import { StatusService } from '../../../../services/product/tariff/status/status.service';
import { ProviderService } from '../../../../services/product/tariff/provider/provider.service';
import { NetworkOperatorService } from '../../../../services/product/tariff/network-operator/network-operator.service';
import { ProductService } from '../../../../services/product/product.service';
import { MainNavbarService } from '../../../../services/main-navbar.service';
import { AttributeGroupService } from '../../../../services/product/tariff/attribute-group/attribute-group.service';

@Component({
  selector: 'app-tariff-list',
  templateUrl: './tariff-list.component.html',
  styleUrl: './tariff-list.component.scss'
})
export class TariffListComponent {
  
  active = 1;
  groupId: number | null = null
  dataLoadedOrNew = false
  IsExpandable = false;

  proviedersLoaded = false
  networkOperatorsLoaded = false
  tariffStatusesLoaded = false

  disabledView = true
  
  parnerColumns: Tablecolumn[] = [
    { key: 'id', title: '#', sortable: true },
    { key: 'external_id', title: 'Id-Ext.', sortable: true }, 
    { key: 'provider.name', title: 'Provider', sortable: true },
    { key: 'name_short', title: 'Tarifname', sortable: true },
    { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
    { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true},
    // { key: 'status.name', title: 'Connect', sortable: true, isIcon: true },
    { key: 'status', title: 'Status', sortable: true, isIcon: true },
    { key: 'is_published', title: 'Web Ativ', sortable: true, isIcon: true },
  ];

  filters: FilterOption[] = [
    { type: 'text', key: 'search', label: 'Search' },
    { type: 'select', key: 'status_id', label: 'Status', options: [] },
    { type: 'select', key: 'provider_id', label: 'Provider', options: [] },
    { type: 'select', key: 'network_operator_id', label: 'Netzbetreiber', options: [] },
    { type: 'select', key: 'is_published', label: 'Web Activ', options: [{label: 'alle', value: 'all'}, {label: 'active', value: 1}, {label: 'inactive', value: 0}] },
  ];


  providers: Provider[] = []
  networkOperators: NetworkOperator[] = []

  private unsubscribe$ = new Subject<void>();

  constructor(
    public tariffService: TariffService,
    private tariffStatusService: StatusService,
    private tariffProviderService: ProviderService,
    private tariffNetworkOperatorService: NetworkOperatorService,
    private productService: ProductService,
    private mainNavbarService: MainNavbarService,
    //private attributeGroupService: AttributeGroupService
  ) {}

  ngOnInit() {    

    

    // this.productService._resetTariffData 
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(event =>{
    //     console.log('reset data')
    //     this.resetData()
    //   })
    this.productService.tariffId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if(!response){
          this.resetState()
        }else{
          this.disabledView = false
        }
      })

      this.tariffService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data){ 
          this.dataLoadedOrNew = true
        }    
      });

    this.productService.tariffGroupId$ 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id =>{
        if(id && this.groupId != id){
          this.groupId = id
          this.tariffProviderService.fetchDataByGroupId(this.groupId)
          this.tariffStatusService.fetchData()
          this.tariffNetworkOperatorService.fetchDataByGroupId(this.groupId)
          //console.log('load provider status networkOperator')      
        }
      })

    this.tariffStatusService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => { 
        if(data){ 
          this.productService.updateInitTariffDataLoaded('statuses', true);

          let item = this.filters.find(item => item.key === 'status_id')
          if(item && data.data.length > 0){
            let options:any  = [{label: 'alle', value: 'all', selected: true}]
            data.data.forEach(item => {
              let option ={
                label: item.name,
                value: item.id
              }
              options.push(option)
            })
            item.options = options
            this.tariffStatusesLoaded = true
          }else if(item && data.data.length == 0){
            item.options = []
          }

        }    
      });

    this.tariffProviderService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data){
          this.productService.updateInitTariffDataLoaded('providers', true); // loaded provider

          let item = this.filters.find(item => item.key === 'provider_id')

          if(item && data.data.length > 0){
            let options:any  = [{label: 'alle', value: 'all', selected: true}]
            data.data.forEach(item => {
              let option ={
                label: item.name,
                value: item.id
              }
              options.push(option)
            })
            item.options = options
            this.proviedersLoaded = true
          }else if(item && data.data.length == 0){
            item.options = []
          }
          
          //console.log(this.filters)
        }    
      });

    this.tariffNetworkOperatorService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data){ 
          this.productService.updateInitTariffDataLoaded('networkOperators', true);

          let item = this.filters.find(item => item.key === 'network_operator_id')
          if(item && data.data.length > 0){
            let options:any  = [{label: 'alle', value: 'all', selected: true}]
            data.data.forEach(item => {
              let option ={
                label: item.name,
                value: item.id
              }
              options.push(option)
            })
            item.options = options
            this.networkOperatorsLoaded
          }else if(item && data.data.length == 0){
            item.options = []
          }
        }    
      });

  }

  sort(event: any){

    this.tariffService.fetchDataByGroupId(this.groupId, event)
    this.mainNavbarService.setIconState('edit', true, true);
    this.productService.resetTariffId()
  }

  filter(event: any){
    this.tariffService.fetchDataByGroupId(this.groupId, event)
    this.mainNavbarService.setIconState('edit', true, true);
    this.productService.resetTariffId()
    //console.log(event)
  }

  selectedRow(event: any){

    if(event){
      this.productService.setTariffId(event.id)
      //this.productService.setSelectedTariff(event)
      this.mainNavbarService.setIconState('edit', true, false);
      this.tariffService.fetchDetailedDataById(event.id)
      //this.attributeGroupService.fetchData(event.id)
    }
    
    //this.tariffService.fetchDataByGroupId(event.id)
  }

  resetState(){
    this.active = 1;

    this.dataLoadedOrNew = false
    this.IsExpandable = false;

    this.proviedersLoaded = false
    this.networkOperatorsLoaded = false
    this.tariffStatusesLoaded = false
    this.disabledView = true
  }

  private resetData(){

    this.tariffService.resetData()
    this.tariffService.resetDetailedData()
    //this.attributeGroupService.resetData()
    this.productService.resetTariffGroupId()
    this.productService.resetTariffId()
    this.productService.resetSelectedTariff()
    this.tariffStatusService.resetData()
    this.tariffNetworkOperatorService.resetData()
    this.tariffProviderService.resetData()
    this.groupId = null
    this.dataLoadedOrNew = false
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    //console.log('destroy list')

    this.productService.updateInitTariffDataLoaded('statuses', false);
    this.productService.updateInitTariffDataLoaded('providers', false);
    this.productService.updateInitTariffDataLoaded('networkOperators', false);
    this.resetData()
    
    //this.tariffService.resetData()
    //this.groupId = undefined
  }
}