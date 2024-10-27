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

  private _productMode = new BehaviorSubject<string | null>(null); // Edit or New for Tariff or Hardware
  public productMode$: Observable<string | null> = this._productMode.asObservable();

  private _tariffGroupId = new BehaviorSubject<number | null>(null);
  public tariffGroupId$: Observable<number | null> = this._tariffGroupId.asObservable();

  private _tariffId = new BehaviorSubject<number | null>(null);
  public tariffId$: Observable<number | null> = this._tariffId.asObservable();

  private _selectedTarif = new BehaviorSubject<any | null>(null);
  public selectedTarif$: Observable<any | null> = this._selectedTarif.asObservable();

  public deletedTariffAttr = new EventEmitter
  public deletedTariffAttrGroup = new EventEmitter
  public deletedTariffMatrix = new EventEmitter

  private destroy$ = new Subject<void>();


  constructor() { 

  }

  resetTariffGroupId(): void {
    this._tariffGroupId.next(null);
    console.log('reset tariff group id')
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

  setSelectedTariff(tariff:any){
    this._selectedTarif.next(tariff)
  }

  resetSelectedTariff(): void {
    this._selectedTarif.next(null);
    console.log('reset selected Tarif')
  }

  setTariffOrHardwareTabActive(id: number){
    this._tariffOrHardwareTabActive.next(id)
  }

  setProductMode(mode: string){
    this._productMode.next(mode)
  }

  resetProductMode(){
    this._productMode.next(null)
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
