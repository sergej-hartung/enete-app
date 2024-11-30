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
            //console.log(data)
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
    this.http.get<TariffDetailedData>(`${this.apiUrl}/products/tariff/${id}`)
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

  addItem(item: Tariff): any {
      
    this.http.post<Tariff>(`${this.apiUrl}/products/tariff`, item)
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe({
          next: newPartner => {
              
              this._detailedData.next({
                data: newPartner,
                requestType: 'post',
                entityType: 'Tariff'
              });
              //this.successSubject.next('created');
          },
          error: (error) => {
              console.log(error)
            this.handleError(error, 'post', 'Tariff')
          }
      });
  }

  updateItem(id: number, item: FormData | any): any {
    this.http.patch<TariffDetailedData>(`${this.apiUrl}/products/tariff/${id}`, item)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: updatedTariff => {
          const currentData = this._data.getValue();
          console.log(currentData)
          console.log(updatedTariff)
          // const currentData = this._data.getValue();

            if (currentData && currentData.data) {
              const updatedData = currentData.data.map(p => {
                if (p.id === updatedTariff['data'].id) {
                  return {...p, ...this.extractBriefInfo(updatedTariff['data']), selected: true};
                }else {                  
                  return {...p, selected: false};
                } 
            });
            this._data.next({...currentData, data: updatedData});
            console.log(this._data.getValue());
          }
          this._detailedData.next({
            data: updatedTariff["data"],
            requestType: 'patch',
            entityType: 'Tariff'
          });
           
        },
        error: (error) => {
            
          this.handleError(error, 'patch', 'Tariff')
        }
    });
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


  private handleError(errorResponse: any, requestType: string = '', entityType: string = '') {
    const errors = {
      requestType: '',
      entityType: '',
      msg: ''
    }
    console.log(errorResponse)
    if(errorResponse?.error?.error){
      errors.requestType = requestType
      errors.entityType = entityType
      errors.msg = errorResponse?.error?.error
    }else{
      errors.requestType = requestType
      errors.entityType = entityType
      errors.msg = 'An unknown error occurred'
    }
     
    this.errorSubject.next(errors);
  }

  private extractBriefInfo(tariff: Tariff): any {
    // Возвращаем только нужные поля
    return {
        id: tariff.id,
        action_group_id: tariff.action_group_id,
        created_at: tariff.created_at,
        created_by: tariff.created_by,
        external_id: tariff.external_id,
        file_id: tariff.file_id,
        group_id: tariff.group_id,
        has_action: tariff.has_action,
        is_published: tariff.is_published,
        name: tariff.name,
        name_short: tariff.name_short,
        network_operator: tariff.network_operator,
        note: tariff.note,
        provider: tariff.provider,
        status: tariff.status,
        updated_at: tariff.updated_at,
        updated_by: tariff.updated_by
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
