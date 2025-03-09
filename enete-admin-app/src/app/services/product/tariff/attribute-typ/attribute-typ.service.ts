import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
//import { DataService } from '../../data.service';
import { DataService } from '../../../data.service';

import { AttributeTyp, AttributeTypData } from '../../../../models/tariff/attributeTyp/attributeTyp';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class AttributeTypService extends DataService<AttributeTyp> {


  private destroy$ = new Subject<void>();



  

  constructor(http: HttpClient) { 
    super(http, environment.apiUrl);
  }

  
  
  

  fetchData(): void {
    this.http.get<AttributeTypData>(`${this.apiUrl}/products/tariff-attribute-types`)
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
              entityType: 'tariffAttributeTypes'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
    
  }

  fetchDetailedDataById(id: number): void {
    
  }

  addItem(item: AttributeTyp | any): any {
   
  }

  updateItem(id:number, item: AttributeTyp): void {
    
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