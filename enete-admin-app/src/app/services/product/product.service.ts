import { EventEmitter, Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';


// PartnerService: Specific service extending DataService for handling Partner type data
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public _resetTariffData = new EventEmitter()

  private _tariffOrHardwareTabActive = new BehaviorSubject<number | null>(null);
  public tariffOrHardwareTabActive$: Observable<number | null> = this._tariffOrHardwareTabActive.asObservable();

  private _tariffGroupId = new BehaviorSubject<number | null>(null);
  public tariffGroupId$: Observable<number | null> = this._tariffGroupId.asObservable();

  private _tariffId = new BehaviorSubject<number | null>(null);
  public tariffId$: Observable<number | null> = this._tariffId.asObservable();

  private destroy$ = new Subject<void>();


  constructor() { 

  }

  resetTariffGroupId(): void {
    this._tariffGroupId.next(null);
  }

  setTariffGroupId(id: number){
    this._tariffGroupId.next(id)
  }

  resetTariffId(): void {
    this._tariffId.next(null);
  }

  setTariffId(id: number){
    this._tariffId.next(id)
  }

  setTariffOrHardwareTabActive(id: number){
    this._tariffOrHardwareTabActive.next(id)
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
