import { ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { Tablecolumn } from '../../../models/tablecolumn';
import { IDataService } from '../../../models/data-interface';
import { Subject, debounceTime, takeUntil } from 'rxjs';


export interface FilterOption {
  type: 'text' | 'select'; // тип фильтра: текстовое поле или выпадающий список
  key: string; // ключ, по которому фильтр будет применяться
  label: string; // метка для отображения пользователю
  options?: { label: string; value: any; selected?: boolean;}[]; // опции для выбора, если это select  
}

export interface Buttons{
  name: string,
  icon: string,
  value: string,
  status: boolean,
  class?: string
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
  @Input() isLoading: boolean = false;  // если идет загрузка данных в mode parent блокируеться выбор selectRow
  @Input() isLoaded: boolean = false;
  @Input() sortMode: 'service'|'parent' = 'service';
  @Input() filterMode: 'service'|'parent' = 'service';
  @Input() dataMode: 'service'|'parent' = 'service';
  @Input() isExpandable?: boolean = false;
  @Input() filters?: FilterOption[] = []
  @Input() dataArr?: any[] = []
  @Input() dataService?: IDataService<T>;
  @Input() total: boolean = true;
  @Input() buttons: Buttons[] = [];
  @Output() rowSelected = new EventEmitter<T>();
  @Output() filterEvent = new EventEmitter<{ [x:string]:any }>();
  @Output() sortEvent = new EventEmitter<{ sortField:string|null, sortOrder:string }>();
  @Output() buttonEvent = new EventEmitter<string>();
  @Output() rowEdit = new EventEmitter<any>();
  @Output() rowEditCancel = new EventEmitter<any>();

  @ContentChild('customFilters') customFilterTemplate?: TemplateRef<any>;

  private unsubscribe$ = new Subject<void>();
  private textFilterSubject = new Subject<{ key: string; value: any }>();
  private selectFilterSubject = new Subject<{ key: string; value: any }>();

  //isLoaded = false;
  isExpanded: boolean = false;
  data?: any[];
  currentSortColumn: string | null = null;
  currentSortOrder: 'asc' | 'desc' | '' = '';

  filterContext = {
    $implicit: this.filters,
    onFilterChange: this.onFilterChange.bind(this)  // Привязываем метод к контексту компонента
  };
    
  constructor(private cdr: ChangeDetectorRef) {
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
    if(this.dataService && this.dataMode == 'service'){
      this.dataService.data$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {  
          if(data){
            console.log('data service')
            this.setData(data["data"]) 
            this.isLoaded = true
          }    
        });
    }else if(this.dataMode == 'parent' && this.dataArr){
      this.setData(this.dataArr) 
      this.isLoaded = true
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["dataArr"] && !changes["dataArr"].isFirstChange()) {
      this.setData(changes["dataArr"].currentValue);
      this.cdr.detectChanges();
    }
  }

  onEditBlur(event: FocusEvent, row:any){
    event.stopPropagation();
    console.log(row)
    if(row.isEditing){
      setTimeout(() => {
        if (row) {
          //this.rowEdit.emit(row)
          this.editRow(row)
          //this.createNewFolder.emit(this.node);
        }
      }, 0);
    }
    
  }

  editRow(row:any){
    console.log('edit')
    this.rowEdit.emit(row)
    row.isEditing = false;
  }

  onEditKeydown(event: KeyboardEvent, row: any){
    console.log(event)
    if (event.key === 'Enter') {
      //this.onEditBlur(new FocusEvent('blur'), row);
      this.editRow(row)
    } else if (event.key === 'Escape') {
      this.rowEditCancel.emit(row)
      this.selectRow
      row.isEditing = false;
      //row.selected = false
    }
  }

  onClickButton(value:string){
    console.log(value)
    this.buttonEvent.emit(value)
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
  

  // selectRow(row: any) {
  //   this.dataService?.confirmAction('selectRow', () => {
  //     if (row.selected) {
  //       return;
  //     }
        
  //     this.data?.forEach(d => {
  //       if (d.selected && d['originalIconColor']) {
  //         d['iconIcon'].color  = d.originalIconColor;
  //       }
  //       d.selected = false
  //     });

  //     row.selected = true;

  //     // Сохраняем исходный цвет иконки и изменяем на белый, если текущий черный
  //     if (row?.iconIcon?.color === 'rgb(54, 54, 54)' || row?.iconIcon?.color === '#363636') {
  //       console.log(row)
  //       row.originalIconColor = row['iconIcon'].color; // Сохраняем исходный цвет
  //       row['iconIcon'].color = '#c0bbb7'; // Изменяем цвет на белый
  //     }
  //     // console.log(row)
  //     if (this.rowSelectionMode === 'service' && this.dataService) {
  //       this.dataService.fetchDetailedDataById(row['id'])       
  //     } else if(this.rowSelectionMode === 'parent') {
  //       this.rowSelected.emit(row);
  //     }
  //   })    
  // }

  selectRow(row: any) {
    if (this.rowSelectionMode === 'service') {
      this.handleServiceRowSelection(row);
    } else if (!this.isLoading && this.rowSelectionMode === 'parent') {
      this.handleParentRowSelection(row);
    }
  }

  private handleServiceRowSelection(row: any) {
    this.dataService?.confirmAction('selectRow', () => {
      if (row.selected) {
        return;
      }
        
      this.data?.forEach(d => {
        if (d.selected && d['originalIconColor']) {
          d['iconIcon'].color  = d.originalIconColor;
        }
        d.selected = false;
      });
  
      row.selected = true;
  
      if (row?.iconIcon?.color === 'rgb(54, 54, 54)' || row?.iconIcon?.color === '#363636') {
        row.originalIconColor = row['iconIcon'].color;
        row['iconIcon'].color = '#c0bbb7';
      }
  
      if (this.dataService) {
        this.dataService.fetchDetailedDataById(row['id']);
      }
    });
  }

  private handleParentRowSelection(row: any) {
    // Здесь вы можете добавить код для управления переключением
    // selectRow с компонента, соответствующего компоненту GenericTableComponent
    // Например, вы можете создать событие и передать выбранную строку
    // для обработки в родительском компоненте, или сделать что-то еще, 
    // соответствующее вашим требованиям.

      if (row.selected) {
        return;
      }

      this.data?.forEach(d => {
        if (d.selected && d['originalIconColor']) {
          d['iconIcon'].color  = d.originalIconColor;
        }
        if(d.selected && d.isEditing){
          d.isEditing = false
        }
        d.selected = false;
      });
  
      row.selected = true;
  
      if (row?.iconIcon?.color === 'rgb(54, 54, 54)' || row?.iconIcon?.color === '#363636') {
        row.originalIconColor = row['iconIcon'].color;
        row['iconIcon'].color = '#c0bbb7';
      }

      this.rowSelected.emit(row);
    
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
    if(this.filterMode === 'service'){
      this.dataService?.confirmAction('filter', () => {
        if(this.dataService){
          this.dataService.fetchData({         
            [filter.key]: filter.value
          });
          this.dataService.resetDetailedData();
        }
      })   
    }else{
      this.filterEvent.emit({[filter.key]: filter.value})
    }   
  }
  
  resetSelectedRow() {
    if (this.data) {
      this.data.forEach(d => d.selected = false);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('destroy generetic table')
  }
}


