import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
//import { DataService } from '../../data.service';
import { DataService } from '../../../data.service';

// import { Attribute, AttributeData } from '../../../../models/tariff/attribute/attribute';
import { AttributeGroup, AttributeGroupData } from '../../../../models/tariff/attributeGroup/attributeGroup';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class AttributeGroupService extends DataService<AttributeGroup> {


  private destroy$ = new Subject<void>();



  

  constructor(http: HttpClient) { 
    super(http, environment.apiUrl);
  }

  

  // get filters(){
  // }

  fetchData(id: any): void{
    this.http.get<AttributeGroupData>(`${this.apiUrl}/products/tariff-attribute-groups/${id}`)
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
              entityType: 'tariffAttributeGroups'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
  }
  

//   fetchData(): void {
//     this.http.get<AttributeGroupData>(`${this.apiUrl}/products/tariff-atributes`)
//       .pipe(
//         takeUntil(this.destroy$),
//         catchError(error => {
//           this.handleError(error);
//           return of(null); // Возвращаем Observable<null> в случае ошибки
//         })
//       )
//       .subscribe({
//         next: data => {
            
//           if (data) {
//             this._data.next({
//               data: data["data"],
//               requestType: 'get',
//               entityType: 'tariffAttributes'
//             });
//           }
//         },
//         error: error => console.error('Ошибка при получении данных:', error)
//       });
    
//   }

  fetchDetailedDataById(id: number): void {
    
  }

  addItem(item: AttributeGroup | any): any {
   
  }

  updateItem(id:number, item: AttributeGroup): void {
    
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