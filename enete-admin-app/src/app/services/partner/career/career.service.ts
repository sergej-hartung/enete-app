import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
import { DataService } from '../../data.service';

import { Career, CareerData } from '../../../models/partner/career/career';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class CareerService extends DataService<Career> {


  private destroy$ = new Subject<void>();



  

  constructor(http: HttpClient) { 
    super(http, environment.apiUrl);
  }

  

  // get filters(){
  // }
  

  fetchData(): void {
    this.http.get<CareerData>(`${this.apiUrl}/user-profile/careers`)
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
              entityType: 'careers'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });   
  }

  fetchDetailedDataById(id: number): void {
    
  }

  addItem(item: Career | any): any {
   
  }

  updateItem(id: number, item: Career): void {
    
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

  confirmAction(action: string, proceedCallback: () => void) {
    this.confirmActionSource.next({action, proceedCallback});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
