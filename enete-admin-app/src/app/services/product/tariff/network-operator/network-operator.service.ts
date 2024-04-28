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



  

  constructor(http: HttpClient) { 
    super(http, environment.apiUrl);
  }

  

  // get filters(){
  // }
  

  fetchData(): void {
    this.http.get<NetworkOperatorData>(`${this.apiUrl}/products/tariff-network-operators`)
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
   
  }

  updateItem(id:number, item: NetworkOperator): void {
    
  }

  deleteItem(id: number): void {
    
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