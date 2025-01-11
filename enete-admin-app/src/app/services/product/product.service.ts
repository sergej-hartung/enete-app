import { EventEmitter, Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

interface LoadedTariffState {
  attributeGroup: boolean;
  calcMatrix: boolean;
  promos: boolean;
  tariff: boolean;
  tariffDetails: boolean;
  tpl: boolean;
}

interface InitDataState {
  attributes: boolean;
  statuses: boolean;
  networkOperators: boolean;
  providers: boolean;
  connectionStatuses: boolean;
  categories: boolean;
  sortings: boolean;
}

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

  private _initTariffDataLoaded = new BehaviorSubject<InitDataState>({
    attributes: false,          //component TariffAttribute
    statuses: false,            // component TariffList
    networkOperators: false,    // component TariffList
    providers: false,           // component TariffList
    connectionStatuses: false,  //component TariffDetailsAE
    categories: false,          //component TariffDetailsAE
    sortings: false,
  });
  public initTariffDataLoaded$: Observable<InitDataState> = this._initTariffDataLoaded.asObservable();

  private _loadedTarif = new BehaviorSubject<LoadedTariffState>({
    attributeGroup: false,  // component TariffAttribute
    calcMatrix: false,      // componet  TariffCalcMatrix
    promos: false,          // component TariffPromo
    tariff: false,          // component TariffDetailsAE
    tariffDetails: false,   // component TariffDetailsTpl
    tpl: false,             // component TariffViewTemplate
  });
  public loadedTarif$: Observable<LoadedTariffState> = this._loadedTarif.asObservable();



  public deletedTariffAttr = new EventEmitter
  public deletedTariffAttrGroup = new EventEmitter
  public deletedTariffMatrix = new EventEmitter

  private destroy$ = new Subject<void>();


  constructor() { 

  }

  public updateTariffLoadedState(key: keyof LoadedTariffState, value: boolean): void {
    const currentState = this._loadedTarif.getValue();
    this._loadedTarif.next({
      ...currentState,
      [key]: value
    });
  }

  public updateInitTariffDataLoaded(key: keyof InitDataState, value: boolean): void {
    const currentState = this._initTariffDataLoaded.getValue();
    this._initTariffDataLoaded.next({
      ...currentState,
      [key]: value
    });
  }

  public areAllTariffsLoaded(): boolean {
    const currentState = this._loadedTarif.getValue();
    return Object.values(currentState).every((loaded) => loaded === true);
  }

  public areAllInitTariffDataLoaded(): boolean {
    const currentState = this._initTariffDataLoaded.getValue();
    return Object.values(currentState).every((loaded) => loaded === true);
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
    //console.log('reset selected Tarif')
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
