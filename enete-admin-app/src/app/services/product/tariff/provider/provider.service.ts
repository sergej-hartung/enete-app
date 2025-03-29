import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
//import { DataService } from '../../data.service';
import { DataService } from '../../../data.service';
import { Provider, ProviderData } from '../../../../models/tariff/provider/provider';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class ProviderService extends DataService<Provider> {


  private destroy$ = new Subject<void>();

  private deleteSuccessSubject = new Subject<number>();
  public deleteSuccess$ = this.deleteSuccessSubject.asObservable();


  

  constructor(http: HttpClient) { 
    super(http, environment.apiUrl);
  }

  

  // get filters(){
  // }

  fetchDataByGroupId(id: any): void{
    this.http.get<ProviderData>(`${this.apiUrl}/products/tariff-groups/${id}/providers`)
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
              entityType: 'tariffProvidersByGroup'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
  }
  

  fetchData(): void {
    this.http.get<ProviderData>(`${this.apiUrl}/products/tariff-providers`)
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
              entityType: 'tariffProvider'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
    
  }

  fetchDetailedDataById(id: number): void {
    
  }

  addItem(item: Provider | any): any {
    console.log(item)
    this.http.post<Provider>(`${this.apiUrl}/products/tariff-providers`, item)
           .pipe(
             takeUntil(this.destroy$),
           )
           .subscribe({
             next: newGroup => {
                 
                 this._detailedData.next({
                   data: newGroup,
                   requestType: 'post',
                   entityType: 'tariffProvider'
                 });
                 //this.successSubject.next('created');
             },
             error: (error) => {
               this.handleError(error, 'post')
             }
         });
  }

  updateItem(id:number, item: Provider): void {
    this.http.patch<{'data': Provider}>(`${this.apiUrl}/products/tariff-providers/${id}`, item)
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
                entityType: 'tariffProvider'
              });
               
            },
            error: (error) => {
              this.handleError(error, 'patch')
            }
        });
  }

  deleteItem(id: number): void {
    console.log(id)
    this.http.delete(`${this.apiUrl}/products/tariff-providers/${id}`)
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

  private extractBriefInfo(provider: Provider): any {
        // Возвращаем только нужные поля
        console.log(provider)
        return {
          id:                       provider?.id,
          name:                     provider?.name,
          logo_id:                  provider?.logo_id,
          is_filled_on_site:        provider?.is_filled_on_site,
          external_fill_link:       provider?.external_fill_link,
          created_at:               provider?.created_at, 
          updated_at:               provider?.updated_at,
          created_by:               provider?.created_by,
          updated_by:               provider?.updated_by,
          tariff_group_ids:         provider?.tariff_group_ids,
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