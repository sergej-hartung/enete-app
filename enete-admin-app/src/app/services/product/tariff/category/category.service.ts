import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
//import { DataService } from '../../data.service';
import { DataService } from '../../../data.service';

import { Category, CategoryData } from '../../../../models/tariff/category/category';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends DataService<Category> {

  private dataLoaded$ = new Subject<void>();

  private destroy$ = new Subject<void>();



  

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
    this.http.get<CategoryData>(`${this.apiUrl}/products/tariff-categories`)
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
              entityType: 'tariffCategory'
            });
            this.dataLoaded$.next();
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
    
  }

  fetchDetailedDataById(id: number): void {
    
  }

  addItem(item: Category | any): any {
   
  }

  updateItem(id:number, item: Category): void {
    
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