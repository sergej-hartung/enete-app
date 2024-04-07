import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
import { DataService } from '../../data.service';



// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class DocumentService extends DataService<any> {


  protected _file = new BehaviorSubject<any | null>(null);
  public file$: Observable<any | null> = this._file.asObservable();

  private destroy$ = new Subject<void>();


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

  

  // get filters(){
  // }
  
  downloadDocumentById(id: number){
    this.http.get(`${this.apiUrl}/user-dockuments/download/${id}`,{responseType: 'blob', observe: 'body'})
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: blob => {
            
          this._file.next(blob);
        },
        error: (error) => {
          this.handleError(error)
        }
      });
  }

  deleteDocumentById(id: number){
    this.http.delete<any>(`${this.apiUrl}/user-dockuments/${id}`)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: data => {
            
          this._data.next({
            data: data,
            requestType: 'delete',
            entityType: 'documents'
          });
        },
        error: (error) => {
          this.handleError(error)
        }
      });
  }

  restoreDocumentById(id:number){
    this.http.get<any>(`${this.apiUrl}/user-dockuments/restore/${id}`)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: data => {
            
          this._data.next({
            data: data,
            requestType: 'get',
            entityType: 'documentRestore'
          });
        },
        error: (error) => {
          this.handleError(error)
        }
      });
  }

  fetchData(params?: {[key: string]: string}): void {
    // Обновляем фильтры, если они предоставлены
    if (params) {
      this.updateFilters(params);
    }
  
    // Создаем HttpParams на основе текущих фильтров
    let httpParams = new HttpParams({ fromObject: this.currentFilters });
  
    this.http.get<any>(`${this.apiUrl}/user-dockuments`, { params: httpParams })
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
              entityType: 'documents'
            });
          }
        },
        error: error => console.error('Ошибка при получении данных:', error)
      });
  }

  fetchDetailedDataById(id: number): void {
    
  }

  addItem(item: any | any): any {
   
  }

  updateItem(id:number, item: any): void {
    
  }

  deleteItem(id: number): void {
    
  }


  private handleError(errorResponse: any) {
    const errors = errorResponse?.error?.errors ?? ['An unknown error occurred'];
    this.errorSubject.next(errors);
  }


  resetData(): void {
    this._data.next(null);
  }

  resetFile(): void {
    this._file.next(null)
  }
 

  resetDetailedData(): void {
    this._detailedData.next(null);
  }

  confirmAction(action: string, proceedCallback: () => void) {
    this.confirmActionSource.next({action, proceedCallback});
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
