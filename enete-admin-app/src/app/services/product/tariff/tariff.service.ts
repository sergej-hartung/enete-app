import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {DataService} from '../../data.service'
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
import { Tariff, TariffData, TariffDetailedData } from '../../../models/tariff/tariff';



// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class TariffService extends DataService<Tariff> {


  private destroy$ = new Subject<void>();
  private formDirty = new BehaviorSubject<boolean | null>(false);

  //public _resetData = new EventEmitter()
  //public tariffGroupId = new EventEmitter()

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
    // if (params) {
    //   this.updateFilters(params);
    // }
  
    // // Создаем HttpParams на основе текущих фильтров
    // let httpParams = new HttpParams({ fromObject: this.currentFilters });
  
    // this.http.get<TariffGroupData>(`${this.apiUrl}/products/tariff-groups`, { params: httpParams })
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     catchError(error => {
    //       this.handleError(error);
    //       return of(null); // Возвращаем Observable<null> в случае ошибки
    //     })
    //   )
    //   .subscribe({
    //     next: data => {
    //         console.log(data)
    //       if (data) {
    //         this._data.next({
    //           data: data["data"],
    //           requestType: 'get',
    //           entityType: 'tariffGroup'
    //         });
    //       }
    //     },
    //     error: error => console.error('Ошибка при получении данных:', error)
    //   });
  }

  fetchDataByGroupId(id: any, params?: {[key: string]: string}): void{
    // Обновляем фильтры, если они предоставлены
    if (params) {
      this.updateFilters(params);
    }
  
    // Создаем HttpParams на основе текущих фильтров
    let httpParams = new HttpParams({ fromObject: this.currentFilters });
  
    this.http.get<TariffData>(`${this.apiUrl}/products/tariff-groups/${id}/tariffs`, { params: httpParams })
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.handleError(error);
          return of(null); // Возвращаем Observable<null> в случае ошибки
        })
      )
      .subscribe({
        next: data => {
            console.log(data)
          if (data) {
            this._data.next({
              data: data["data"],
              requestType: 'get',
              entityType: 'tariffsByGroup'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
  }

  fetchDetailedDataById(id: number): void {
    this.http.get<TariffDetailedData>(`${this.apiUrl}/products/tariffs/${id}`)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: data => {
            
          this._detailedData.next({
            data: data["data"],
            requestType: 'get',
            entityType: 'Tariff'
          });
        },
        error: (error) => {
          this.handleError(error)
        }
      });
  }

  addItem(item: FormData | any): any {
      
    // this.http.post<Partner>(`${this.apiUrl}/user-profile/employees`, item)
    //     .pipe(
    //       takeUntil(this.destroy$),
    //     )
    //     .subscribe({
    //       next: newPartner => {
              
    //           this._detailedData.next({
    //             data: newPartner,
    //             requestType: 'post',
    //             entityType: 'partner'
    //           });
    //           //this.successSubject.next('created');
    //       },
    //       error: (error) => {
              
    //         this.handleError(error)
    //       }
    //   });
  }

  updateItem(id: number, item: FormData | any): any {
    // item.append('_method', 'PATCH')
    // this.http.post<{'data': Partner}>(`${this.apiUrl}/user-profile/employees/${id}`, item)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: updatedPartner => {
    //       const currentData = this._data.getValue();

    //         if (currentData && currentData.data) {
    //           const updatedData = currentData.data.map(p => {
    //             if (p.id === updatedPartner['data'].id) {
    //                 // Устанавливаем свойство selected в true только для обновленного партнера
    //                 return {...p, ...this.extractBriefInfo(updatedPartner['data']), selected: true};
    //             } else {
    //                 // Убеждаемся, что свойство selected установлено в false для всех остальных партнеров
    //                 return {...p, selected: false};
    //             }
    //         });
    //         this._data.next({...currentData, data: updatedData});
    //       }
    //       this._detailedData.next({
    //         data: updatedPartner["data"],
    //         requestType: 'patch',
    //         entityType: 'partner'
    //       });
           
    //     },
    //     error: (error) => {
            
    //       this.handleError(error)
    //     }
    // });
  }

  deleteItem(id: number): void {
    // this.http.delete(`${this.apiUrl}/user-profiles/${id}`)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: () => {
    //         // Получаем текущие данные
    //         const currentDataResponse = this._data.getValue();
            
    //         // Проверяем, что текущие данные не undefined
    //         if (currentDataResponse && currentDataResponse.data) {
    //             // Фильтруем данные, исключая удаленный элемент
    //             const remainingData = currentDataResponse.data.filter(p => p.id !== id);

    //             // Обновляем BehaviorSubject новым объектом DataResponse
    //             this._data.next({
    //                 ...currentDataResponse,
    //                 data: remainingData
    //             });
    //         }
    //     },
    //     error: error => console.error('Ошибка при удалении партнера:', error)
    // });
  }


  private handleError(errorResponse: any) {
    const errors = errorResponse?.error?.errors ?? ['An unknown error occurred'];
    this.errorSubject.next(errors);
  }

  private extractBriefInfo(group: Tariff): any {
    // Возвращаем только нужные поля
    return {
        id: group.id,
        name: group.name,
        icon: group.icon
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

  resetData():void {
    this._data.next(null);
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
