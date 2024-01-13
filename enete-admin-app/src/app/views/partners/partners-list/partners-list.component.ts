import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {Tablecolumn } from '../../../models/tablecolumn';
import {Partner} from '../../../models/partner/partner';
import { Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PartnerService } from '../../../services/partner/partner.service'
import { UserLogin } from '../../../models/user-login';
import { FilterOption, GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { MainNavbarService } from '../../../services/main-navbar.service';
import { StatusService } from '../../../services/partner/status/status.service';
import { CategorieService } from '../../../services/partner/categorie/categorie.service';
import { Status } from '../../../models/partner/status/status';
import { Categorie } from '../../../models/partner/categorie/categorie';



@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  styleUrl: './partners-list.component.scss'
})
export class PartnersListComponent implements OnInit, OnDestroy {

  @ViewChild('genericTable') genericTableComponent!: GenericTableComponent<PartnerService>;

  IsExpandable?: boolean
  parnerColumns: Tablecolumn[] = []
  filters?: FilterOption[]

  private unsubscribe$ = new Subject<void>();
  
  constructor(
    public partnerService: PartnerService,
    private statusService: StatusService,
    private categorieService: CategorieService,
    private mainNavbarService: MainNavbarService
  ) {

    this.parnerColumns = [
      {key: 'id', title: '#', sortable: true},
      {key: 'vp_nr', title: 'GP-NR.', sortable: true},
      {key: 'last_name', title: 'Nachname', sortable: true},
      {key: 'first_name', title: 'Vorname', sortable: true},
      {key: 'accesses', title: 'Zugang', isIcon: true},
      {key: 'status', title: 'Status', sortable: true, isIcon: true},
    ]

    this.filters = [
      { type: 'text', key: 'search', label: 'Search' },
      {
        type: 'select',
        key: 'status_id',
        label: 'Status',
        options: [],
      },
      {
        type: 'select',
        key: 'user_profile_categorie_id',
        label: 'Kategorie',
        options: [],
      }
    ]

    this.IsExpandable = true
  }
  
  ngOnInit() {
    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(iconName => {
        if (iconName === 'new') {
          this.genericTableComponent.resetSelectedRow()
        }
    });

    this.statusService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if(data){                       
          if(data.requestType == "get" && data.entityType == 'statuses'){
            this.setStatuses(data.data)
            this.checkFilters()
          }
        }
      })

    this.categorieService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        console.log(data)
        if(data){                       
          if(data.requestType == "get" && data.entityType == 'categories'){
            
            this.setCategories(data.data)
            this.checkFilters()
          }
        }
      })
  }

  setCategories(data: Categorie[]){
    let options = <{label: string, value: string}[]>[{label: 'Alle', value: ''}]

    data.forEach(d => {
      let option = {
        label: d.name,
        value: d.id.toString()
      }
      options.push(option)
    })

    let filter = this.filters?.find(f => f.type === "select" && f.key === 'user_profile_categorie_id' && f.label === 'Kategorie')
    if(filter) filter.options = options
  }

  setStatuses(data: Status[]){
    let options = <{label: string, value: string}[]>[{label: 'Alle', value: ''}]

    data.forEach(d => {
      let option = {
        label: d.name,
        value: d.id.toString()
      }
      options.push(option)
    })

    let filter = this.filters?.find(f => f.type === "select" && f.key === 'status_id' && f.label === 'Status')
    if(filter) filter.options = options
  }

  checkFilters(){
    if(this.partnerService.filters && !this.isObjectEmpty(this.partnerService.filters)){
      let dataServiceFilters = this.partnerService.filters
      Object.keys(dataServiceFilters).forEach(filterKey => {
        let filter = this.filters?.find(f => f.type === 'select' && f.key == filterKey)
        if(filter && 'options' in filter){
          let selectedFilter = filter.options?.find(o => o.value === dataServiceFilters[filterKey])
          console.log(selectedFilter)
          if(selectedFilter) selectedFilter['selected'] = true
        }
      })
    }
  }

  isObjectEmpty(objectName: Object){
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

