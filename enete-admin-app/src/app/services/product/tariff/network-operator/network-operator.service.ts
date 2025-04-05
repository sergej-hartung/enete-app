import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
//import { DataService } from '../../data.service';
import { DataService } from '../../../data.service';
import { NetworkOperator, NetworkOperatorData } from '../../../../models/tariff/network-operator/network-operator';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class NetworkOperatorService extends DataService<NetworkOperator> {


  private destroy$ = new Subject<void>();

  private deleteSuccessSubject = new Subject<number>();
  public deleteSuccess$ = this.deleteSuccessSubject.asObservable();

  override get filters(){
    return this.currentFilters
  }

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

  

  fetchDataByGroupId(id: any): void{
    this.http.get<NetworkOperatorData>(`${this.apiUrl}/products/tariff-groups/${id}/network-operators`)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.handleError(error, 'get');
          return of(null); // Возвращаем Observable<null> в случае ошибки
        })
      )
      .subscribe({
        next: data => {
          if (data) {
            this._data.next({
              data: data["data"],
              requestType: 'get',
              entityType: 'tariffNetworkOperatorByGroup'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
  }

  fetchData(params?: {[key: string]: string}): void {
    if (params) {
      this.updateFilters(params);
    }

    // Создаем HttpParams на основе текущих фильтров
    let httpParams = new HttpParams({ fromObject: this.currentFilters });
    this.http.get<NetworkOperatorData>(`${this.apiUrl}/products/tariff-network-operators`, { params: httpParams })
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.handleError(error, 'get');
          return of(null); // Возвращаем Observable<null> в случае ошибки
        })
      )
      .subscribe({
        next: data => {
            
          if (data) {
            this._data.next({
              data: data["data"],
              requestType: 'get',
              entityType: 'tariffNetworkOperator'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
    
  }

  fetchDetailedDataById(id: number): void {
    
  }

  addItem(item: NetworkOperator | any): any {
    this.http.post<NetworkOperator>(`${this.apiUrl}/products/tariff-network-operators`, item)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: newGroup => {
            
            this._detailedData.next({
              data: newGroup,
              requestType: 'post',
              entityType: 'tariffNetworkOperator'
            });
            //this.successSubject.next('created');
        },
        error: (error) => {
          this.handleError(error, 'post')
        }
    });
  }

  updateItem(id:number, item: NetworkOperator): void {
    this.http.patch<{'data': NetworkOperator}>(`${this.apiUrl}/products/tariff-network-operators/${id}`, item)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: updatedGroup => {
          const currentData = this._data.getValue();

            if (currentData && currentData.data) {
              const updatedData = currentData.data.map(p => {
                if (p.id === updatedGroup['data'].id) {
                    // Устанавливаем свойство selected в true только для обновленного партнера
                    return {...p, ...this.extractBriefInfo(updatedGroup['data']), selected: true};
                }else {                  
                  return {...p, selected: false};
                } 
            });

            this._data.next({...currentData, data: updatedData});
          }
          this._detailedData.next({
            data: updatedGroup["data"],
            requestType: 'patch',
            entityType: 'tariffNetworkOperator'
          });
            
        },
        error: (error) => {
          this.handleError(error, 'patch')
        }
    });
  }

  deleteItem(id: number): void {
    this.http.delete(`${this.apiUrl}/products/tariff-network-operators/${id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
            // Получаем текущие данные
            const currentDataResponse = this._data.getValue();
            
            // Проверяем, что текущие данные не undefined
            if (currentDataResponse && currentDataResponse.data) {
                // Фильтруем данные, исключая удаленный элемент
                const remainingData = currentDataResponse.data.filter(p => p.id !== id);

                // Обновляем BehaviorSubject новым объектом DataResponse
                this._data.next({
                    ...currentDataResponse,
                    data: remainingData
                });

                this.deleteSuccessSubject.next(id);
            }
        },
        //error: error => console.error('Das Löschen der Tarifgruppe ist fehlgeschlagen:', error)
        error: (error) => {         
          this.handleError(error, 'delete')
        }
    });
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


  private handleError(errorResponse: any, requestType: string) {
    let errors = {
      errors: ['An unknown error occurred'],
      requestType: requestType
    }
    if(errorResponse?.error?.errors){
      errors.errors = errorResponse?.error?.errors
    }
    if(errorResponse?.error?.message){
      errors.errors = [errorResponse?.error?.message]
    }
    this.errorSubject.next(errors);
  }

 private extractBriefInfo(networkOperator: NetworkOperator): any {
         // Возвращаем только нужные поля
         console.log(networkOperator)
         return {
           id:                       networkOperator?.id,
           name:                     networkOperator?.name,
           logo_id:                  networkOperator?.logo_id,
           file_name:                networkOperator?.file_name,
           created_at:               networkOperator?.created_at, 
           updated_at:               networkOperator?.updated_at,
           created_by:               networkOperator?.created_by,
           updated_by:               networkOperator?.updated_by,
           tariff_group_ids:         networkOperator?.tariff_group_ids,
             // Добавьте другие поля, которые необходимы для краткого представления
         };
       }

  resetDetailedData(): void {
    this._detailedData.next(null);
  }
  resetData():void {
    this._data.next(null);
  }

  confirmAction(action: string, proceedCallback: () => void) {
    this.confirmActionSource.next({action, proceedCallback});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}