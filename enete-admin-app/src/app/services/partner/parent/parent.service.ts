import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PartnerData, Partner } from '../../../models/partner/partner';
import {DataService} from '../../data.service'
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class ParentService extends DataService<Partner> {


  private destroy$ = new Subject<void>();
  private formDirty = new BehaviorSubject<boolean | null>(false);

  private currentFilters: {[key: string]: string} = {
    // Примеры параметров фильтрации
    // 'search': 'test',
    // 'status': '1',
    // Примеры параметров сортировки
    // 'sortField': 'last_name',
    // 'sortOrder': 'asc'
  };

  constructor(http: HttpClient) { 
    super(http, environment.apiUrl);
  }

  override get filters(){
    return this.currentFilters
  }


  fetchData(params?: {[key: string]: string}): void {

    // Обновляем фильтры, если они предоставлены
    if (params) {
      this.updateFilters(params);
    }
  
    // Создаем HttpParams на основе текущих фильтров
    let httpParams = new HttpParams({ fromObject: this.currentFilters });
  
    this.http.get<PartnerData>(`${this.apiUrl}/user-profile/employees/parent`, { params: httpParams })
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.handleError(error);
          return of(null); // Возвращаем Observable<null> в случае ошибки
        })
      )
      .subscribe({
        next: data => {
            
          if (data) {
            this._data.next({
              data: data["data"],
              requestType: 'get',
              entityType: 'partners'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
  }

  fetchDetailedDataById(id: number): void {
   
  }

  addItem(item: FormData | any): any {
    
  }

  updateItem(id: number, item: FormData | any): any {
    
  }

  deleteItem(id: number): void {

  }


  private handleError(errorResponse: any) {
    const errors = errorResponse?.error?.errors ?? ['An unknown error occurred'];
    this.errorSubject.next(errors);
  }

  private extractBriefInfo(partner: Partner): any {
    // Возвращаем только нужные поля
    return {
        id: partner.id,
        first_name: partner.first_name,
        last_name: partner.last_name,
        status: partner.status,
        vp_nr: partner.vp_nr,
        accesses: partner.users,
        // Добавьте другие поля, которые необходимы для краткого представления
    };
  }

  private updateFilters(newFilters: {[key: string]: string}): void {
    Object.keys(newFilters).forEach(key => {
      const value = newFilters[key];
      if (value) {
        this.currentFilters[key] = value;
      } else {
        delete this.currentFilters[key];
      }
    });
  }
  
  // private updateFilters(filters: {[key: string]: string}): void {

  //   const updatedFilters = {...this.currentFilters};

  //   Object.keys(filters).forEach(key => {
  //       const value = filters[key];
  //       if(value !== null && value !== '') {
  //           updatedFilters[key] = value;
  //       } else {
  //           delete updatedFilters[key];
  //       }
  //   });

  //   this.currentFilters = updatedFilters;
  // }

  resetDetailedData(): void {
    this._detailedData.next(null);
  }

  confirmAction(action: string, proceedCallback: () => void) {
    this.confirmActionSource.next({action, proceedCallback});
  }

  setFormDirty(isDirty: boolean) {
    this.formDirty.next(isDirty);
  }

  getFormDirty(): Observable<boolean | null> {
    return this.formDirty.asObservable();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
