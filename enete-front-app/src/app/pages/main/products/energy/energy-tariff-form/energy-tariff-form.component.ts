import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbCollapseModule, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, of, OperatorFunction, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { EnergyService } from '../service/energy-service.service';
import { HttpEnergyService } from '../service/http-energy.service';
import { LocationSelectorComponent } from './location-selector/location-selector.component';
import { ConsumptionFormComponent } from './consumption-form/consumption-form.component';
import { BaseProviderFormComponent } from './base-provider-form/base-provider-form.component';
import { EnergyTariffFormFactoryService } from '../service/energy-tariff-form-factory.service';
import { BranchSelectorComponent } from './branch-selector/branch-selector.component';
import { TypeSelectorComponent } from './type-selector/type-selector.component';
import { BaseProvider, BaseRate, City, NetzProvider, PeopleMap } from '../types/types';
import { EnergyTariffFilterComponent } from '../energy-tariff-filter/energy-tariff-filter.component';



@Component({
  selector: 'app-energy-tariff-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    //NgbTypeahead,
    LocationSelectorComponent,
    ConsumptionFormComponent,
    BaseProviderFormComponent,
    BranchSelectorComponent,
    TypeSelectorComponent
  ],
  templateUrl: './energy-tariff-form.component.html',
  styleUrl: './energy-tariff-form.component.scss'
})
export class EnergyTariffFormComponent {
  @Input() show = true;
  //@ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  blur$ = new Subject<string>();
  click$ = new Subject<string>();

  peopleMap: PeopleMap = {
    electric: { one: '2000', two: '3500', three: '4250', four: '5000'},
    gas: { one: '5000', two: '12000', three: '18000', four: '20000' }
  }

  citys: City[] = [];
  streets: string[] = []
  netzProviders: NetzProvider[] = [];
  baseProviders: BaseProvider[] = [];
  baseRates: BaseRate[] = []; // base Rates for select Base Provider
  isLoadedBaseProvider = true
  isCollapsed = true

  tariffForm: FormGroup;

  private destroyRef = inject(DestroyRef);
  private httpEnergieService = inject(HttpEnergyService);
  private energyService = inject(EnergyService);
  private modalService = inject(NgbModal);
  private formFactory = inject(EnergyTariffFormFactoryService);

  branchMap: { [key in 'electric' | 'gas' | 'warmth']: string } = {
    electric: 'Strom',
    gas: 'Gas',
    warmth: 'Wärme'
  };

  typeMap: { [key in 'private' | 'company' | 'weg']: string } = {
    private: 'Privat',
    company: 'Gewerbe',
    weg: 'WEG'
  };


  //closeResult = '';

  constructor() { 
    this.tariffForm = this.formFactory.createCombinedForm();
  }

  ngOnInit() {
    this.setupFormSubscriptions()
  }

  private setupFormSubscriptions(): void {
    this.tariffForm.get('branch')!.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((branch: 'electric' | 'gas' | 'warmth') => {
      if (branch) {
        this.updateBranchSettings(branch);
      }
    });

    this.tariffForm.get('type')!.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((type: 'private' | 'company' | 'weg') => {
      if (type) {
        this.updateTypeSettings(type);
      }
    });

    // Zip
    this.tariffForm.get('tariffsQuery.zip')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(zip => zip && zip.length === 5 && /^[0-9]+$/.test(zip)),
      tap(() => {
        this.resetForm();
        this.tariffForm.get('tariffsQuery.city')?.disable();
      }),
      switchMap(zip => this.httpEnergieService.getCitiesByZip(zip)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(cities => {
      this.citys = cities ?? [];
      const cityCtrl = this.tariffForm.get('tariffsQuery.city');
      if (this.citys.length > 0 && !cityCtrl?.value) {
        cityCtrl?.setValue(this.citys[0]);
      }
      cityCtrl?.enable();
    });

    // City
    this.tariffForm.get('tariffsQuery.city')?.valueChanges.pipe(
      filter(city => city && 'zip' in city && 'city' in city),
      switchMap(city => {
        const zip = city.zip;
        const cityName = city.city;
        return this.httpEnergieService.getStreets(zip, cityName);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.streets = result || [];
      this.tariffForm.get('tariffsQuery.street')?.reset();
    });

    // Street
    this.tariffForm.get('tariffsQuery.street')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.tariffForm.get('tariffsQuery.houseNumber')?.reset()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    // houseNumber
    this.tariffForm.get('tariffsQuery.houseNumber')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((hn: string) => !!hn),
      tap(() => {
        this.tariffForm.get('tariffsQuery.netzProv')?.disable();
        this.loadNetzProvider()
      }), // neue Methode
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.blur$.pipe(
      filter((val: string) => !!val),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res: string) => {
      const found = this.streets.includes(res);
      if (!found) {
        this.tariffForm.get('tariffsQuery.street')?.setValue('');
      }
    });

    this.tariffForm.get('tariffsQueryTwo.people')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      res => {
        if (res) {
          const type = this.tariffForm.get('branch')!.value === 'warmth' ? 'electric' : this.tariffForm.get('branch')!.value as keyof PeopleMap;
          if (type in this.peopleMap && res in this.peopleMap[type]) {
            this.tariffForm.get('tariffsQueryTwo.consum')?.setValue(this.peopleMap[type][res]);
          }
        }
      }
    );

    this.tariffForm.get('tariffsQueryThree.providerName')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (res: BaseProvider | string) => {
        if (res && typeof res === 'object' &&  'rates' in res && res.rates.length > 0) {
          this.baseRates = res.rates
          this.tariffForm.get('tariffsQueryThree.rateName')?.reset()
          this.tariffForm.get('tariffsQueryThree.rateName')?.setValue(res.rates[0])
          //this.setBasePrice(res.rates[0])
        }
      }
    )

    this.tariffForm.get('tariffsQueryThree.rateName')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (res: BaseRate | string) => {
        if (res && typeof res === 'object') {
          this.setBasePrice(res)
        }
      }
    )

    combineLatest([
      this.tariffForm.get('tariffsQueryTwo.consum')!.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged()
      ),
      this.tariffForm.get('tariffsQueryTwo.consumNt')!.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
    ])
    .pipe(
      filter(([ht, nt]: [string, string]) => !!ht || !!nt),
      switchMap(([ht, nt]: [string, string]) => this.onQuery(ht || nt)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => this.resetThreeForm());
  }

  // search Street
  search: OperatorFunction<string, string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.streets.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  private loadNetzProvider(): void {
    const zip = this.tariffForm.get('tariffsQuery.zip')!.value as string;
    const city = this.tariffForm.get('tariffsQuery.city')!.value?.city as string;
    const street = this.tariffForm.get('tariffsQuery.street')!.value as string;
    const houseNumber = this.tariffForm.get('tariffsQuery.houseNumber')!.value as string;
    const branch = this.tariffForm.get('branch')!.value === 'warmth' ? 'electric' : this.tariffForm.get('branch')!.value as 'electric' | 'gas' | 'warmth';

    if (!zip || !city || !street || !houseNumber || !branch) return;

    this.httpEnergieService.getNetzProvider({
      zip,
      city,
      street,
      houseNumber,
      branch
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      this.netzProviders = result;
      if (this.netzProviders.length > 0 && 'netzName' in this.netzProviders[0]) {
        this.tariffForm.get('tariffsQuery.netzProv')?.setValue(this.netzProviders[0]);
      }
      this.tariffForm.get('tariffsQuery.netzProv')?.enable()
    });
  }


  loadBaseProvider() {
    this.resetThreeForm()
    this.tariffForm.get('tariffsQueryThree')?.disable();
    let data = this.getDataForBaseProviderLoad()
    this.isLoadedBaseProvider = false
    this.httpEnergieService.getBaseProvider(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (result: BaseProvider[]) => {
        this.baseProviders = result
        
        if (this.baseProviders.length > 0) {
          this.tariffForm.get('tariffsQueryThree.providerName')?.setValue(this.baseProviders[0])
        }
        
        this.tariffForm.get('tariffsQueryThree')?.enable({ emitEvent: false });
        this.isLoadedBaseProvider = true
      }
    )
  }


  resetBaseProvider() {
    this.resetThreeForm()
  }


  updateBranchSettings(branch: 'electric' | 'gas' | 'warmth') {
      switch (branch) {
        case 'electric': {
          console.log('disabled Strom')
          this.tariffForm.get('tariffsQueryTwo.consumNt')?.disable()
          this.tariffForm.get('tariffsQueryTwo.consumNt')?.reset()
          this.tariffForm.get('tariffsQueryTwo.rateType')?.disable()
          this.tariffForm.get('tariffsQueryTwo.rateType')?.setValue('0')
          this.tariffForm.get('tariffsQueryTwo.rateReadingType')?.disable()
          this.tariffForm.get('tariffsQueryTwo.rateReadingType')?.setValue('0')
          this.resetThreeForm()
          break; 
        }
        case 'gas': {
          console.log('disabled Gas')
          this.tariffForm.get('tariffsQueryTwo.consumNt')?.disable()
          this.tariffForm.get('tariffsQueryTwo.consumNt')?.reset()
          this.tariffForm.get('tariffsQueryTwo.rateType')?.disable()
          this.tariffForm.get('tariffsQueryTwo.rateType')?.reset()
          this.tariffForm.get('tariffsQueryTwo.rateReadingType')?.disable()
          this.tariffForm.get('tariffsQueryTwo.rateReadingType')?.setValue('0')
          this.resetThreeForm()
          break; 
        }
        case 'warmth': {
          console.log('disabled Währme')
          this.tariffForm.get('tariffsQueryTwo.consumNt')?.enable()
          this.tariffForm.get('tariffsQueryTwo.rateType')?.enable()
          this.tariffForm.get('tariffsQueryTwo.rateType')?.setValue('1')
          this.tariffForm.get('tariffsQueryTwo.rateReadingType')?.enable()
          this.tariffForm.get('tariffsQueryTwo.rateReadingType')?.setValue('1')
          this.resetThreeForm()
          break; 
        }
      }
      this.tariffForm.get('tariffsQuery.netzProv')?.disable();
      this.loadNetzProvider()
      this.tariffForm.get('tariffsQueryTwo.people')?.reset();
    
  }

  getDataForBaseProviderLoad() {
    let data: {
      branch: string ;
      type: string ;
      zip: string ;
      city: string ;
      consum: string ;
      consumNt?: string;
    } = {
      branch: '',
      type: '',
      zip: '',
      city: '',
      consum: ''
    };
    const branchResult = this.getBranch();
    const typeResult = this.getTyp();
    const city = this.tariffForm.get('tariffsQuery.city')?.value?.city
    const consumNt = this.tariffForm.get('tariffsQueryTwo.consumNt')?.value

    data.branch = typeof branchResult === 'string' ? branchResult : branchResult.branch;
    data.type = typeof typeResult === 'string' ? typeResult : typeResult.type || '';
    data.zip = this.tariffForm.get('tariffsQuery.zip')?.value || '';
    data.city = city ? city : ''
    data.consum = this.tariffForm.get('tariffsQueryTwo.consum')?.value || '';

    if (consumNt){
      data.consumNt = consumNt
    } 

    return data
  }

  setBasePrice(rate: BaseRate) {
    if (rate && 'basePriceYear' in rate && 'workPrice' in rate && 'workPriceNt' in rate ) {
      this.tariffForm.get('tariffsQueryThree.basePriceYear')?.setValue(Number(rate.basePriceYear).toFixed(2))
      this.tariffForm.get('tariffsQueryThree.workPrice')?.setValue(Number(rate.workPrice).toFixed(4))
      this.tariffForm.get('tariffsQueryThree.workPriceNt')?.setValue(Number(rate.workPriceNt).toFixed(4))
    }   
  }

  private extractFormData(form: FormGroup, excludeKeys: string[] = [], nestedKeys: string[] = []): any {
    return Object.entries(form.value).reduce((acc, [key, value]) => {
      if (value && !excludeKeys.includes(key)) {
        // Wenn verschachteltes Objekt wie city { city: '', zip: '' }
        if (nestedKeys.includes(key) && typeof value === 'object' && 'city' in value) {
          acc[key] = value['city'];
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as any);
  }

  private updateTypeSettings(type: 'private' | 'company' | 'weg') {
    switch (type) {
      case 'private':
      case 'company':
      case 'weg':
        this.resetThreeForm();
        break;
    }
  }


  toggleFilter(event: any) {
    this.modalService.open(EnergyTariffFilterComponent, { modalDialogClass: 'energie-rechner-filter-modal'})
  }

  getTarifs() {
    let ratesData = Object.assign({}, 
      this.getBranch(true), 
      this.getTyp(true), 
      this.getTariffsQuery(), 
      this.getTariffsQueryTwo(), 
      this.getTariffsQueryThree()
    )
    this.energyService.ratesData = ratesData;
    console.log(this.energyService.ratesData)
  }

  getBranch(returnObj = false): string | { branch: string } {
    const val = this.tariffForm.get('branch')!.value;
    const branch = val === 'warmth' ? 'electric' : val;

    if (returnObj) {
      return { branch: branch || '' };
    } else {
      return branch || '';
    }
  }

  getTyp(returnObj = false): string | { type: string } {
    const val =  this.tariffForm.get('type')!.value
    if (returnObj) {
      return { type: val || '' };
    }
    return val || '';
  }

  
  getTariffsQuery() {
    return this.extractFormData(this.tariffForm.get('tariffsQuery') as FormGroup, ['netzProv'], ['city'])
  }

  TariffsQuery(){
    return this.tariffForm.get('tariffsQuery') as FormGroup
  }

  getTariffsQueryTwo() {
    return this.extractFormData(this.tariffForm.get('tariffsQueryTwo') as FormGroup, ['people'])
  }

  TariffsQueryTwo(){
    return this.tariffForm.get('tariffsQueryTwo') as FormGroup
  }

  getTariffsQueryThree() {
    return this.extractFormData(this.tariffForm.get('tariffsQueryThree') as FormGroup, ['rateName'])
  }

  TariffsQueryThree(){
    return this.tariffForm.get('tariffsQueryThree') as FormGroup
  }

  
  onConsumptionChange(value: string) {
    this.tariffForm.get('tariffsQueryTwo.people')?.reset()
    this.onQuery(value).subscribe(() => this.resetThreeForm());
  }

  onQuery(query: string | null): Observable<any> {
    if (query != null) {
      return of(query)
    } else {
      return of(false)
    }
  }

  resetForm() {
    this.tariffForm.get('tariffsQuery.city')?.reset()
    this.citys = []
    this.tariffForm.get('tariffsQuery.street')?.reset()
    this.streets = []
    this.tariffForm.get('tariffsQuery.houseNumber')?.reset()
    this.tariffForm.get('tariffsQuery.netzProv')?.reset()
    this.netzProviders = []
    this.baseProviders = []
    this.baseRates = []
    this.tariffForm.get('tariffsQueryThree')?.reset();

    this.energyService.resetDataRatesForm$.next();
  }

  resetThreeForm() {
    this.baseProviders = []
    this.baseRates = []
    this.tariffForm.get('tariffsQueryThree')?.reset();

    this.energyService.resetDataRatesForm$.next();
  }

 
}
