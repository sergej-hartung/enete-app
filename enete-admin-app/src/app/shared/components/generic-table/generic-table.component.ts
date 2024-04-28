import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
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
        id: number,
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
  @Input() sortMode: 'service'|'parent' = 'service';
  @Input() filterMode: 'service'|'parent' = 'service';
  @Input() isExpandable?: boolean = false;
  @Input() filters?: FilterOption[] = []
  @Input() dataService?: IDataService<T>;
  @Input() total: boolean = true;
  @Output() rowSelected = new EventEmitter<T>();
  @Output() filterEvent = new EventEmitter<{ [x:string]:any }>();
  @Output() sortEvent = new EventEmitter<{ sortField:string|null, sortOrder:string }>();

  @ContentChild('customFilters') customFilterTemplate?: TemplateRef<any>;

  private unsubscribe$ = new Subject<void>();
  private textFilterSubject = new Subject<{ key: string; value: any }>();
  private selectFilterSubject = new Subject<{ key: string; value: any }>();

  isLoaded = false;
  isExpanded: boolean = false;
  data?: any[];
  currentSortColumn: string | null = null;
  currentSortOrder: 'asc' | 'desc' | '' = '';

  filterContext = {
    $implicit: this.filters,
    onFilterChange: this.onFilterChange.bind(this)  // Привязываем метод к контексту компонента
  };
    
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
            this.isLoaded = true
          }    
        });
    }
  }

  setData(data: T[]) {
    this.data = data.map(item => {
      const result = { ...item as any };
      this.columns?.forEach(column => {
        if (column['isIcon']) {
          result[column['key'] + 'Icon'] = this.getIconData(item, column['key']);
        }
      });
      return result;
    });
  }

  resolveNestedPath(object: any, path: string): any {
    return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, object);
  }
  

  getIconData(item: any, key: string): { icon?: string; color?: string } {
    if (key === 'accesses') {
      return this.getAccessIcon(item['accesses']);
    } else if (key === 'status' && item['status']) {
      return { icon: item.status['icon'], color: item.status['color']};
    } else if (key === 'icon' && item['icon']) {
      return { icon: item.icon, color: item.color};
    } else if(key === 'is_published'){
      return this.getIsPublishedIcon(item['is_published'])
    }
    return {};  // Return empty object when no icon data should be added
  }

  getIsPublishedIcon(isPublished: number): { icon: string; color: string }{
    return { icon: isPublished === 1 ? 'fa-check-circle fas': 'fa-times-circle fas', color: isPublished === 1 ? '#69b548' : '#c00' }
  }

  getAccessIcon(accesses: any[]): { icon: string; color: string } {
    const access = accesses.find(a => a.status && a.status.id === 1) || accesses.find(a => a.status && a.status.id === 2);
    return access ? { icon: 'fa-solid fa-key', color: access.status.id === 1 ? '#69b548' : '#C41425' } : { icon: 'fa-solid fa-key', color: '#ccc' };
  }
  

  selectRow(row: any) {
    this.dataService?.confirmAction('selectRow', () => {
      if (row.selected) {
        return;
      }
        
      this.data?.forEach(d => d.selected = false);
      row.selected = true;
  
      if (this.rowSelectionMode === 'service' && this.dataService) {
        //  
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
        
      if (this.currentSortColumn === column) {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : this.currentSortOrder === 'desc' ? '' : 'asc';
        if(this.currentSortOrder === '') this.currentSortColumn = null;
      } else {
        this.currentSortColumn = column;
        this.currentSortOrder = 'asc';
      }

      if(this.sortMode === 'service'){
        if (this.dataService) {
          //this.isLoded = false 
          this.dataService.fetchData({ 
            sortField: this.currentSortColumn,
            sortOrder: this.currentSortOrder
          });
          this.dataService.resetDetailedData();
        }
      }else{
        this.sortEvent.emit({
          sortField: this.currentSortColumn,
          sortOrder: this.currentSortOrder
        })
      }
  
      
    })   
  }

  

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    // this.expanded.emit(this.isExpanded); 
       
  }

  applyFilter(filter: { key: string; value: any }) {
    this.dataService?.confirmAction('filter', () => {
      if(this.filterMode === 'service'){
        if(this.dataService){
          this.dataService.fetchData({         
            [filter.key]: filter.value
          });
          this.dataService.resetDetailedData();
        }
      }else{
        this.filterEvent.emit({[filter.key]: filter.value})
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


