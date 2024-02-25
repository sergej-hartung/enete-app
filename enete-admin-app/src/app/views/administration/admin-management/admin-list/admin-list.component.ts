import { Component, ViewChild } from '@angular/core';
import { FilterOption, GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { AdminService } from '../../../../services/admin/admin.service';
import { Tablecolumn } from '../../../../models/tablecolumn';
import { Subject, takeUntil } from 'rxjs';
import { MainNavbarService } from '../../../../services/main-navbar.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss'
})
export class AdminListComponent {

  @ViewChild('genericTable') genericTableComponent!: GenericTableComponent<AdminService>;

  IsExpandable?: boolean
  adminColumns: Tablecolumn[] = []
  filters?: FilterOption[]

  private unsubscribe$ = new Subject<void>();
  
  constructor(
    public adminService: AdminService,
    // private statusService: StatusService,
    // private categorieService: CategorieService,
    private mainNavbarService: MainNavbarService
  ) {

    this.adminColumns = [
      {key: 'id', title: '#', sortable: true},
      // {key: 'vp_nr', title: 'GP-NR.', sortable: true},
      {key: 'last_name', title: 'Nachname', sortable: true},
      {key: 'first_name', title: 'Vorname', sortable: true},
      {key: 'accesses', title: 'Zugang', isIcon: true},
      //{key: 'status', title: 'Status', sortable: true, isIcon: true},
    ]

    this.filters = [
      { type: 'text', key: 'search', label: 'Search' },
      // {
      //   type: 'select',
      //   key: 'status_id',
      //   label: 'Status',
      //   options: [],
      // },
      // {
      //   type: 'select',
      //   key: 'user_profile_categorie_id',
      //   label: 'Kategorie',
      //   options: [],
      // }
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

    // this.statusService.data$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(data => {
    //     if(data){                       
    //       if(data.requestType == "get" && data.entityType == 'statuses'){
    //         this.setStatuses(data.data)
    //         this.checkFilters()
    //       }
    //     }
    //   })

    // this.categorieService.data$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(data => {
    //     // console.log(data)
    //     if(data){                       
    //       if(data.requestType == "get" && data.entityType == 'categories'){
            
    //         this.setCategories(data.data)
    //         this.checkFilters()
    //       }
    //     }
    //   })
  }

  // setCategories(data: Categorie[]){
  //   let options = <{label: string, value: string}[]>[{label: 'Alle', value: ''}]

  //   data.forEach(d => {
  //     let option = {
  //       label: d.name,
  //       value: d.id.toString()
  //     }
  //     options.push(option)
  //   })

  //   let filter = this.filters?.find(f => f.type === "select" && f.key === 'user_profile_categorie_id' && f.label === 'Kategorie')
  //   if(filter) filter.options = options
  // }

  // setStatuses(data: Status[]){
  //   let options = <{label: string, value: string}[]>[{label: 'Alle', value: ''}]

  //   data.forEach(d => {
  //     let option = {
  //       label: d.name,
  //       value: d.id.toString()
  //     }
  //     options.push(option)
  //   })

  //   let filter = this.filters?.find(f => f.type === "select" && f.key === 'status_id' && f.label === 'Status')
  //   if(filter) filter.options = options
  // }

  checkFilters(){
    if(this.adminService.filters && !this.isObjectEmpty(this.adminService.filters)){
      let dataServiceFilters = this.adminService.filters
      Object.keys(dataServiceFilters).forEach(filterKey => {
        let filter = this.filters?.find(f => f.type === 'select' && f.key == filterKey)
        if(filter && 'options' in filter){
          let selectedFilter = filter.options?.find(o => o.value === dataServiceFilters[filterKey])
          // console.log(selectedFilter)
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
