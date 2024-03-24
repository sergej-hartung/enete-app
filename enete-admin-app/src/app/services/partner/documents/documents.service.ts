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
          console.log(blob)
          this._file.next(blob);
        },
        error: (error) => {
          this.handleError(error)
        }
      });
  }

  fetchData(): void {
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
