import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
//import { DataService } from '../../data.service';
import { DataService } from '../../../data.service';

import { ComboStatus, ComboStatusData } from '../../../../models/tariff/comboStatus/comboStatus';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class ComboStatusService extends DataService<ComboStatus> {


  private destroy$ = new Subject<void>();

  private dataLoaded$ = new Subject<void>();


  

  constructor(http: HttpClient) { 
    super(http, environment.apiUrl);
  }

  

  // get filters(){
  // }

  fetchDataByGroupId(id: any): void{
    // this.http.get<CategoryData>(`${this.apiUrl}/products/tariff-groups/${id}/providers`)
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     catchError(error => {
    //       this.handleError(error);
    //       return of(null); // Возвращаем Observable<null> в случае ошибки
    //     })
    //   )
    //   .subscribe({
    //     next: data => {
    //       if (data) {
    //         this._data.next({
    //           data: data["data"],
    //           requestType: 'get',
    //           entityType: 'tariffProvidersByGroup'
    //         });
    //       }
    //     },
    //     error: error => console.error('Ошибка при получении данных:', error)
    //   });
  }
  

  fetchData(): void {
    this.http.get<ComboStatusData>(`${this.apiUrl}/products/tariff-combo-statuses`)
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
              entityType: 'tariffComboStatus'
            });
            this.dataLoaded$.next();
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
    
  }

  fetchDetailedDataById(id: number): void {
    
  }

  addItem(item: ComboStatus | any): any {
   
  }

  updateItem(id:number, item: ComboStatus): void {
    
  }

  deleteItem(id: number): void {
    
  }

  getDataLoadedObservable(): Observable<void> {
    return this.dataLoaded$.asObservable();
  }


  private handleError(errorResponse: any) {
    const errors = errorResponse?.error?.errors ?? ['An unknown error occurred'];
    this.errorSubject.next(errors);
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