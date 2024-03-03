import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tablecolumn } from '../../../models/tablecolumn';
import { IDataService } from '../../../models/data-interface';
import { Subject, debounceTime, takeUntil } from 'rxjs';

export interface FilterOption {
  type: 'text' | 'select'; // тип фильтра: текстовое поле или выпадающий список
  key: string; // ключ, по которому фильтр будет применяться
  label: string; // метка для отображения пользователю
  options?: { label: string; value: any; selected?: boolean;}[]; // опции для выбора, если это select  
}

interface Accessible {
  accesses?: {
      status?: {
          name: string;
      };
  }[];
}

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent<T> {
  
  @Input() columns?: Tablecolumn[];
  @Input() rowSelectionMode: 'service'|'parent' = 'service';
  @Input() isExpandable?: boolean = false;
  @Input() filters?: FilterOption[] = []
  @Input() dataService?: IDataService<T>;
  @Output() rowSelected = new EventEmitter<T>();

  private unsubscribe$ = new Subject<void>();
  private textFilterSubject = new Subject<{ key: string; value: any }>();
  private selectFilterSubject = new Subject<{ key: string; value: any }>();

  isLoded = false;
  isExpanded: boolean = false;
  data?: any[];
  currentSortColumn: string | null = null;
  currentSortOrder: 'asc' | 'desc' | '' = '';
    
  constructor() {
    this.textFilterSubject
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(debounceTime(300)) // задержка для текстового ввода
      .subscribe(filter => this.applyFilter(filter));
  
    this.selectFilterSubject
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(debounceTime(0)) // без задержки для выпадающего списка
      .subscribe(filter => this.applyFilter(filter));
  }

  ngOnInit() {
    if(this.dataService){
      this.dataService.data$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {  
          if(data){
            this.setData(data["data"]) 
            this.isLoded = true
          }            
          //this.isLoded = true 
          // console.log(data)       
        });
    }

    //this.checkFilters()
  }

  // checkFilters(){
  //   if(this.dataService && this.dataService?.filters && !this.isObjectEmpty(this.dataService.filters)){
  //     let dataServiceFilters = this.dataService.filters
  //     Object.keys(dataServiceFilters).forEach(filterKey => {
  //       console.log(this.filters)
  //       let filter = this.filters?.find(f => {
  //         //console.log(f.type === 'select')
  //         //console.log(f.key == filterKey)
  //         console.log(f.key)
  //         //console.log(filterKey)
  //         // f.type === 'select' && 
  //       })
  //       console.log(filter)
  //       console.log(this.filters)
  //       console.log(filterKey)
  //       if(filter && 'options' in filter){
  //         let selectedFilter = filter.options?.find(o => o.value === dataServiceFilters[filterKey])
  //         console.log(selectedFilter)
  //         if(selectedFilter) selectedFilter['selected'] = true
  //       }
  //     })
  //   }
  // }

  // isObjectEmpty(objectName: Object){
  //   return (
  //     objectName &&
  //     Object.keys(objectName).length === 0 &&
  //     objectName.constructor === Object
  //   );
  // }

  setData(data: T[]){
    this.data = data.map(d => {
      const item = d as any; 

      return {
        ...item,
        accesses: this.getAccessIcon(item.accesses),
        //status_id: this.getStatusIcon(item.status)
      };
    });
  }

  // getStatusIcon(status: any) {
  //   if(status && 'name' in status){
  //     switch (status.name) {
  //       case 'Aktiv':
  //         return 'fa-solid fa-circle-check text-success-custom';
  //       case 'Inaktiv':
  //         return 'fa-solid fa-circle-exclamation text-warning'; 
  //       case 'Interessent':
  //         return 'fa-solid fa-circle-info text-info'; // Пример другого класса иконки
  //       case 'Gesperrt':
  //         return 'fa-solid fa-circle-xmark text-danger'; // Пример другого класса иконки
  //       case 'Gekündigt':
  //         return 'fa-solid fa-circle-xmark text-danger'; // Пример другого класса иконки
  //       default:
  //         return '';
  //     }
  //   }else{
  //     return '';
  //   }
    
  // }
  
  getAccessIcon(accesses: Accessible['accesses']) {
    let access 
    if(accesses){
      access = accesses.find(a => a.status && a.status.name === 'active');
      if(access){
        return {'icon': 'fa-solid fa-key', 'color': '#69b548'}
      }else{
        access = accesses.find(a => a.status && a.status.name === 'inactive');
        if(access) return {'icon': 'fa-solid fa-key', 'color': '#C41425'}
      }

      console.log(accesses)
    }  
    return {'icon': 'fa-solid fa-key', 'color': '#ccc'}
    //return access ? {'icon': 'fa-solid fa-key', 'color': '#69b548'} : {'icon': 'fa-solid fa-key', 'color': '#C41425'}; // Пример классов для состояния доступа
  }

  selectRow(row: any) {
    this.dataService?.confirmAction('selectRow', () => {
      if (row.selected) {
        return;
      }
      console.log(this.data)
      this.data?.forEach(d => d.selected = false);
      row.selected = true;
  
      if (this.rowSelectionMode === 'service' && this.dataService) {
        //console.log("Взаимодействие с сервисом", row);
        this.dataService.fetchDetailedDataById(row['id'])
        
      } else if(this.rowSelectionMode === 'parent') {
        this.rowSelected.emit(row);
      }
    })    
  }


  onFilterChange(filterOption: FilterOption, event: Event) {
    const element = event.target as HTMLInputElement | HTMLSelectElement;
    const value = element.value;
    const key = filterOption.key;
  
    if (value !== null && value !== undefined) {
      if (filterOption.type === 'text') {
        this.textFilterSubject.next({ key, value });
      } else if (filterOption.type === 'select') {
        this.selectFilterSubject.next({ key, value });
      }
    }
  }

  sort(column: string): void {
    this.dataService?.confirmAction('sort', () => {
      console.log(column)
      if (this.currentSortColumn === column) {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : this.currentSortOrder === 'desc' ? '' : 'asc';
        if(this.currentSortOrder === '') this.currentSortColumn = null;
      } else {
        this.currentSortColumn = column;
        this.currentSortOrder = 'asc';
      }
  
      if (this.dataService) {
        //this.isLoded = false 
        this.dataService.fetchData({ 
          sortField: this.currentSortColumn,
          sortOrder: this.currentSortOrder
        });
        this.dataService.resetDetailedData();
      }
    })   
  }

  

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    // this.expanded.emit(this.isExpanded); 
     console.log(this.isExpanded)
  }

  applyFilter(filter: { key: string; value: any }) {
    this.dataService?.confirmAction('filter', () => {
      if(this.dataService){
        this.dataService.fetchData({         
          [filter.key]: filter.value
        });
        this.dataService.resetDetailedData();
      }
    })
    
  }
  
  resetSelectedRow() {
    if (this.data) {
      this.data.forEach(d => d.selected = false);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}


