import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PartnerData, Partner } from '../models/partner';
import {DataService} from './data.service'
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerService extends DataService<Partner> {


  private destroy$ = new Subject<void>();
  private formDirty = new BehaviorSubject<boolean | null>(false);

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

  get filters(){
    return this.currentFilters
  }


  fetchData(params?: {[key: string]: string}): void {

    let httpParams = new HttpParams();

    if (params) {
        this.updateFilters(params)
        console.log(this.currentFilters)
        Object.keys(this.currentFilters).forEach(key => {
            if (this.currentFilters[key] !== null && this.currentFilters[key] !== undefined) {
                httpParams = httpParams.set(key, this.currentFilters[key]);
            }
        });
    }

    this.http.get<PartnerData>(`${this.apiUrl}/user-profiles`, { params: httpParams })
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: data => {
          this._data.next(data.data)
        },
        error: (error) => {
          this.handleError(error.error.errors)
        }
        
      });
  }

  fetchDetailedDataById(id: number): void {
    this.http.get<{'data': Partner}>(`${this.apiUrl}/user-profiles/${id}`)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: data => {
          this._detailedData.next(data.data);
        },
        error: (error) => {
          this.handleError(error.error.errors)
        }
      });
  }

  addItem(item: Partner | any): any {

    this.http.post<Partner>(`${this.apiUrl}/user-profiles`, item)
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe({
          next: newPartner => {
            console.log(newPartner)
              //this._detailedData.next(null);
              this.successSubject.next('created');
          },
          error: (error) => {
            console.log(error)
            this.handleError(error.error.errors)
          }
      });
  }

  updateItem(item: Partner): void {
      // Ваша реализация обновления партнёра
      // Пример:
      this.http.put<Partner>(`${this.apiUrl}/${item.id}`, item)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: updatedPartner => {
              // Обновите поток данных после обновления
              const currentData = this._data.getValue();
              const updatedData = currentData.map(p => p.id === updatedPartner.id ? updatedPartner : p);
              this._data.next(updatedData);              
          },
          error: error => console.error('Ошибка при  партнера:', error)
      });
  }

  deleteItem(id: number): void {
      // Ваша реализация удаления партнёра
      // Пример:
      this.http.delete(`${this.apiUrl}/${id}`)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
              // Обновите поток данных после удаления
              const remainingData = this._data.getValue().filter(p => p.id !== id);
              this._data.next(remainingData);
          },
          error: error => console.error('Ошибка при  партнера:', error)
      });
  }


  private handleError(errors: any) {
    this.errorSubject.next(errors);
  }

  
  private updateFilters(filters: {[key: string]: string}): void {

    const updatedFilters = {...this.currentFilters};

    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if(value !== null && value !== '') {
            updatedFilters[key] = value;
        } else {
            delete updatedFilters[key];
        }
    });

    this.currentFilters = updatedFilters;
  }

  resetDetailedData(): void {
    this._detailedData.next(null);
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

}
