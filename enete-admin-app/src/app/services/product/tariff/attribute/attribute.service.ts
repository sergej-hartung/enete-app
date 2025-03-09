import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
//import { DataService } from '../../data.service';
import { DataService } from '../../../data.service';

import { Attribute, AttributeData } from '../../../../models/tariff/attribute/attribute';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class AttributeService extends DataService<Attribute> {


  private destroy$ = new Subject<void>();



  

  constructor(http: HttpClient) { 
    super(http, environment.apiUrl);
  }

  

  // get filters(){
  // }

  fetchDataByGroupId(id: any): void{
    this.http.get<AttributeData>(`${this.apiUrl}/products/tariff-groups/${id}/attributs`)
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
              entityType: 'tariffAttributsByGroup'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
  }
  

  fetchData(): void {
    this.http.get<AttributeData>(`${this.apiUrl}/products/tariff-attributes`)
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
              entityType: 'tariffAttributs'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
    
  }

  fetchDetailedDataById(id: number): void {
    
  }

  addItem(item: Attribute): any {
        
    this.http.post<Attribute>(`${this.apiUrl}/products/tariff-attributes`, item)
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe({
          next: newGroup => {
              
              this._detailedData.next({
                data: newGroup,
                requestType: 'post',
                entityType: 'tariffAttribute'
              });
              //this.successSubject.next('created');
          },
          error: (error) => {
            this.handleError(error, 'post')
          }
      });
  }

  updateItem(id:number, item: Attribute): void {
    this.http.patch<{'data': Attribute}>(`${this.apiUrl}/products/tariff-attributes/${id}`, item)
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
            entityType: 'tariffAttribute'
          });
            
        },
        error: (error) => {
          this.handleError(error, 'patch')
        }
    });
  }

  deleteItem(id: number): void {
    
  }

  private extractBriefInfo(attribute: Attribute): any {
      // Возвращаем только нужные поля
      console.log(attribute)
      return {
        code:                     attribute?.code,
        created_at:               attribute?.created_at, 
        created_by:               attribute?.created_by,
        details:                  attribute?.details,
        id:                       attribute?.id,
        input_type_id:            attribute?.input_type_id,
        is_frontend_visible:      attribute?.is_frontend_visible,
        is_frontend_visible_text: attribute?.is_frontend_visible_text,
        is_required:              attribute?.is_required,
        is_required_text:         attribute?.is_required_text,
        is_system:                attribute?.is_system,
        is_system_text:           attribute?.is_system_text, 
        name:                     attribute?.name,
        tariff_group_ids:         attribute?.tariff_group_ids,
        unit:                     attribute?.unit,
        updated_at:               attribute?.updated_at,
        updated_by:               attribute?.updated_by
          // Добавьте другие поля, которые необходимы для краткого представления
      };
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