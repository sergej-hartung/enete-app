import { Component } from '@angular/core';
import { Tablecolumn } from '../../../models/tablecolumn';
import { FilterOption } from '../../../shared/components/generic-table/generic-table.component';
import { ProductService } from '../../../services/product/product.service'
import { TariffService } from '../../../services/product/tariff/tariff.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { StatusService } from '../../../services/product/tariff/status/status.service';
import { ProviderService } from '../../../services/product/tariff/provider/provider.service';
import { NetworkOperatorService } from '../../../services/product/tariff/network-operator/network-operator.service';
import { Status } from '../../../models/tariff/status/status';
import { Provider } from '../../../models/tariff/provider/provider';
import { NetworkOperator } from '../../../models/tariff/network-operator/network-operator';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  active = 1;
  groupId = undefined
  dataLoadedOrNew = false
  IsExpandable = false;
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
    { type: 'select', key: 'is_published', label: 'Web Activ', options: [{label: 'alle', value: '0'}, {label: 'active', value: 1}, {label: 'inactive', value: 2}] },
  ];


  providers: Provider[] = []
  networkOperators: NetworkOperator[] = []

  private unsubscribe$ = new Subject<void>();

  constructor(
    public tariffService: TariffService,
    private tariffStatusService: StatusService,
    private tariffProviderService: ProviderService,
    private tariffNetworkOperatorService: NetworkOperatorService
  ) {}

  ngOnInit() {    

    this.tariffService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data){ 
          this.dataLoadedOrNew = true
        }    
      });

    this.tariffService._resetData 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(event =>{
        this.tariffService.resetData()
        this.dataLoadedOrNew = false
      })

    this.tariffService.tariffGroupId 
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id =>{
        this.groupId = id

        this.tariffProviderService.fetchDataByGroupId(this.groupId)
        this.tariffStatusService.fetchData()
        this.tariffNetworkOperatorService.fetchData()
      })

    this.tariffStatusService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data){ 
          let item = this.filters.find(item => item.key === 'status_id')
          if(item && data.data.length > 0){
            let options:any  = [{label: 'alle', value: '0', selected: true}]
            data.data.forEach(item => {
              let option ={
                label: item.name,
                value: item.id
              }
              options.push(option)
            })
            item.options = options
          }
        }    
      });

    this.tariffProviderService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data){ 
          let item = this.filters.find(item => item.key === 'provider_id')
          if(item && data.data.length > 0){
            let options:any  = [{label: 'alle', value: '0', selected: true}]
            data.data.forEach(item => {
              let option ={
                label: item.name,
                value: item.id
              }
              options.push(option)
            })
            item.options = options
          }

          console.log(this.filters)
        }    
      });

    this.tariffNetworkOperatorService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data){ 
          let item = this.filters.find(item => item.key === 'network_operator_id')
          if(item && data.data.length > 0){
            let options:any  = [{label: 'alle', value: '0', selected: true}]
            data.data.forEach(item => {
              let option ={
                label: item.name,
                value: item.id
              }
              options.push(option)
            })
            item.options = options
          }

          console.log(this.filters)
        }    
      });

  }

  sort(event: any){
    console.log(event)
    this.tariffService.fetchDataByGroupId(this.groupId, event)
  }

  filter(event: any){
    this.tariffService.fetchDataByGroupId(this.groupId, event)
    //console.log(event)
  }

  selectedRow(event: any){
    console.log(event)
    //this.tariffService.fetchDataByGroupId(event.id)
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('destroy list')

    this.tariffService.resetData()
    this.groupId = undefined
  }
  
}
