import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {DataService} from '../../data.service'
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
import { TariffGroup, TariffGroupData } from '../../../models/tariff/group/group';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class TariffGroupService extends DataService<TariffGroup> {


  private destroy$ = new Subject<void>();
  private formDirty = new BehaviorSubject<boolean | null>(false);

  private deleteSuccessSubject = new Subject<number>();
  public deleteSuccess$ = this.deleteSuccessSubject.asObservable();

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
  
    this.http.get<TariffGroupData>(`${this.apiUrl}/products/tariff-groups`, { params: httpParams })
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.handleError(error, 'get');
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
              entityType: 'tariffGroup'
            });
          }
        },
        error: error => console.error('Fehler beim Abrufen der Daten:', error)
      });
  }

  fetchDetailedDataById(id: number): void {
    // this.http.get<{'data': Partner}>(`${this.apiUrl}/user-profile/employees/${id}`)
    //   .pipe(
    //     takeUntil(this.destroy$),
    //   )
    //   .subscribe({
    //     next: data => {
            
    //       this._detailedData.next({
    //         data: data["data"],
    //         requestType: 'get',
    //         entityType: 'partner'
    //       });
    //     },
    //     error: (error) => {
    //       this.handleError(error)
    //     }
    //   });
  }

  addItem(item: TariffGroup): any {
      
    this.http.post<TariffGroup>(`${this.apiUrl}/products/tariff-groups`, item)
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe({
          next: newGroup => {
              
              this._detailedData.next({
                data: newGroup,
                requestType: 'post',
                entityType: 'tariffGroup'
              });
              //this.successSubject.next('created');
          },
          error: (error) => {
            this.handleError(error, 'post')
          }
      });
  }

  updateItem(id: number, item: TariffGroup | any): any {
    this.http.patch<{'data': TariffGroup}>(`${this.apiUrl}/products/tariff-groups/${id}`, item)
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
            entityType: 'tariffGroup'
          });
           
        },
        error: (error) => {
          this.handleError(error, 'patch')
        }
    });
  }

  deleteItem(id: number): void {
    this.http.delete(`${this.apiUrl}/products/tariff-groups/${id}`)
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
    console.log(errorResponse)
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

  private extractBriefInfo(group: TariffGroup): any {
    // Возвращаем только нужные поля
    return {
        id: group.id,
        name: group.name,
        icon: group.icon,
        color: group.color
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
