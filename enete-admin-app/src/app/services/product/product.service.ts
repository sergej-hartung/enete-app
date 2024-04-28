import { EventEmitter, Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public _resetTariffData = new EventEmitter()

  private _tariffGroupId = new BehaviorSubject<number | null>(null);
  public tariffGroupId$: Observable<number | null> = this._tariffGroupId.asObservable();

  private destroy$ = new Subject<void>();


  constructor() { 

  }

  resetTariffGroupId(): void {
    this._tariffGroupId.next(null);
  }

  setTariggGroupId(id: number){
    this._tariffGroupId.next(id)
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
