import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbCollapseModule, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable, of, OperatorFunction, Subject, switchMap, takeUntil } from 'rxjs';
import { EnergyService } from '../service/energy-service.service';
import { HttpEnergyService } from '../service/http-energy.service';
import { LocationSelectorComponent } from './location-selector/location-selector.component';
import { ConsumptionFormComponent } from './consumption-form/consumption-form.component';
import { BaseProviderFormComponent } from './base-provider-form/base-provider-form.component';


interface City {
  city: string;
  zip?: string;
}

interface NetzProvider {
  netzName: string;
}

interface BaseRate {
  rateName: string;
  basePriceYear: number;
  workPrice: number;
  workPriceNt: number;
}

interface BaseProvider {
  providerName: string;
  //rates: BaseRate[];
}

interface PeopleMap {
  [key: string]: { [key: string]: string };
  electric: { one: string; two: string; three: string; four: string };
  gas: { one: string; two: string; three: string; four: string };
}

@Component({
  selector: 'app-energy-tariff-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    NgbTypeahead,
    LocationSelectorComponent,
    ConsumptionFormComponent,
    BaseProviderFormComponent
  ],
  templateUrl: './energy-tariff-form.component.html',
  styleUrl: './energy-tariff-form.component.scss'
})
export class EnergyTariffFormComponent {

  @Input() show = true;

  //private ngUnsubscribe = new Subject();
  private destroyRef = inject(DestroyRef);
  closeResult = '';

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  blur$ = new Subject<string>();
  click$ = new Subject<string>();


  branchMap = {
    electric: 'Strom',
    gas: 'Gas',
    warmth: 'Wärme'
  }

  typeMap = {
    private: 'Privat',
    company: 'Gewerbe',
    weg: 'WEG'
  }

  peopleMap: PeopleMap = {
    electric: {
      one: '2000',
      two: '3500',
      three: '4250',
      four: '5000'
    },
    gas: {
      one: '5000',
      two: '12000',
      three: '18000',
      four: '20000'
    }
  }

  selectBranchName = this.branchMap.electric
  selectTypeName = this.typeMap.private
  citys: City[] = [];
  streets: string[] = []
  netzProviders: NetzProvider[] = [];
  baseProviders: BaseProvider[] = [];
  baseRates: BaseRate[] = []; // base Rates for select Base Provider
  isLoadedBaseProvider = true
  isCollapsed = true

  branchs = new FormGroup({
    branch: new FormControl<'electric' | 'gas' | 'warmth'>('electric', Validators.required)
  })

  typs = new FormGroup({
    type: new FormControl('private', Validators.required,)
  })

  tariffsQuery = new FormGroup({
    zip: new FormControl<string | null>('', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5)]),
    city: new FormControl<City | null>(null, Validators.required),
    street: new FormControl('', Validators.required),
    houseNumber: new FormControl('', Validators.required),
    netzProv: new FormControl<NetzProvider | null>(null, Validators.required)
  })

  tariffsQueryTwo = new FormGroup({
    people: new FormControl(),
    consum: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    consumNt: new FormControl('', Validators.pattern('[0-9]+')),
    rateType: new FormControl({value: '0', disabled: true }),
    rateReadingType: new FormControl({ value: '0', disabled: true }),
  })

  tariffsQueryThree = new FormGroup({
    providerName: new FormControl(),
    rateName: new FormControl(),
    basePriceYear: new FormControl('', Validators.pattern('[0-9,/.]+')),
    workPrice: new FormControl('', Validators.pattern('[0-9,/.]+')),
    workPriceNt: new FormControl('', Validators.pattern('[0-9,/.]+'))
  })

  constructor(
    private httpEnergieService: HttpEnergyService,
    private energyService: EnergyService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    // Set Branch z.b Strom | Gas
    this.branchs.get('branch')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      val => {
        if (val) {
          this.getSelectBranchName(val)
          this.energyService.resetDataRatesForm$.next();
        }       
      }
    )

    // Set Typ z.b Private | Gewerbe
    this.typs.get('type')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      val => {
        if (val === 'private' || val === 'company' || val === 'weg') {
          this.getSelectTypeName(val);
        }
        this.energyService.resetDataRatesForm$.next();
      }
    )


    // Set City
    this.tariffsQuery.get('zip')?.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((queryZip) => this.onQuery(queryZip)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      query => {
        this.resetForm()

        if (query !== false && query.length == 5 && Number(query)) {
          this.resetForm()
          this.tariffsQuery.get('city')?.disable()
          
          this.httpEnergieService.getCitiesByZip(query).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
            result => {
              if(result){
                this.citys = result
                console.log(result)
                console.log(this.citys)
                if (this.citys.length > 0 && 'city' in this.citys[0]) {
                  this.tariffsQuery.get('city')?.setValue(this.citys[0])
                }

                this.tariffsQuery.get('city')?.enable()
              }
              
            }
          )
        }
      })

    // Set Street
    this.tariffsQuery.get('city')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      query => {
        if (query && 'city' in query && 'zip' in query) {
          const ZIP = query.zip ? query.zip : ''
          this.httpEnergieService.getStreets(ZIP, query.city).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
            result => {
              this.streets = result
              //if (this.streets.length > 0 && 'street' in this.streets[0]) this.tariffsQuery.get('street').setValue(this.streets[0])
            }
          )
        }

      }
    )

    // check street changes
    this.tariffsQuery.get('street')?.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((querySteet) => this.onQuery(querySteet)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      query => {
        this.tariffsQuery.get('houseNumber')?.reset()
      })

    this.tariffsQuery.get('houseNumber')?.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((queryZip) => this.onQuery(queryZip)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      query => {
        if (query) {
          this.setNetzprovider()
        }
      }
    )


    // Check Street Valid
    this.blur$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      res => {
        console.log(res)
        let street = this.streets.find(street => street === res)
        if (!street) {
          this.tariffsQuery.get('street')?.setValue('')
        }
      }
    )

    this.tariffsQueryTwo.get('people')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      res => {
        console.log(res)
        //console.log(this.branchs)
        if (res) {
          let type = this.branchs.get('branch')!.value === 'warmth' ? 'electric' : this.branchs.get('branch')!.value as keyof PeopleMap;
          if (type && res in this.peopleMap[type]) {
            this.tariffsQueryTwo.get('consum')?.setValue(this.peopleMap[type][res])
          }
        }
      }
    )

    this.tariffsQueryThree.get('providerName')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      res => {
        
        if (res && 'rates' in res && res.rates.length > 0) {
          console.log(res, 'providerName')
          this.baseRates = res.rates
          this.tariffsQueryThree.get('rateName')?.reset()
          this.tariffsQueryThree.get('rateName')?.setValue(res.rates[0])
          //this.setBasePrice(res.rates[0])
        }
      }
    )

    this.tariffsQueryThree.get('rateName')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      res => {
        if (res) {
          console.log(res, 'rateName')
          this.setBasePrice(res)
        }
      }
    )


    this.tariffsQueryTwo.get('consum')?.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((queryZip) => this.onQuery(queryZip)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      query => {
        this.resetThreeForm()
      })


    this.tariffsQueryTwo.get('consumNt')?.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((queryZip) => this.onQuery(queryZip)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      query => {
        this.resetThreeForm()
      })

  }

  // search Street
  search: OperatorFunction<string, string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.streets.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  setNetzprovider() {
    let zip = this.tariffsQuery.get('zip')?.value
    let city = this.tariffsQuery.get('city')?.value?.city ? this.tariffsQuery.get('city')?.value?.city : ''
    let street = this.tariffsQuery.get('street')?.value
    let houseNumber = this.tariffsQuery.get('houseNumber')?.value
    let branch = this.branchs.get('branch')?.value == 'warmth' ? 'electric' : this.branchs.get('branch')?.value


    if (zip && city && street && houseNumber && branch) {
      this.httpEnergieService.getNetzProvider({ zip: zip, city: city, street: street, houseNumber: houseNumber, branch: branch }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
        result => {
          this.netzProviders = result
          if (this.netzProviders.length > 0 && 'netzName' in this.netzProviders[0]){
            this.tariffsQuery.get('netzProv')?.setValue(this.netzProviders[0])
          } 
        }
      )
    }
  }


  loadBaseProvider() {
    this.resetThreeForm()
    this.tariffsQueryThree.disable()
    let data = this.getDataForBaseProviderLoad()
    this.httpEnergieService.getBaseProvider(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      result => {
        console.log(result)
        this.baseProviders = result
        
        if (this.baseProviders.length > 0) {
          this.tariffsQueryThree.get('providerName')?.setValue(this.baseProviders[0])
        }
        
        this.tariffsQueryThree.enable({emitEvent:false})
        this.isLoadedBaseProvider = true
      }
    )
  }


  resetBaseProvider() {
    this.resetThreeForm()
  }


  getSelectBranchName(branch: 'electric' | 'gas' | 'warmth') {
    if (branch && this.branchMap[branch]) {
      this.selectBranchName = this.branchMap[branch]
      switch (branch) {
        case 'electric': {
          console.log('disabled Strom')
          this.tariffsQueryTwo.get('consumNt')?.enable()
          this.tariffsQueryTwo.get('rateType')?.disable()
          this.tariffsQueryTwo.get('rateType')?.setValue('0')
          this.tariffsQueryTwo.get('rateReadingType')?.disable()
          this.tariffsQueryTwo.get('rateReadingType')?.setValue('0')
          this.resetThreeForm()
          break; 
        }
        case 'gas': {
          console.log('disabled Gas')
          this.tariffsQueryTwo.get('consumNt')?.disable()
          this.tariffsQueryTwo.get('consumNt')?.reset()
          this.tariffsQueryTwo.get('rateType')?.disable()
          this.tariffsQueryTwo.get('rateType')?.reset()
          this.tariffsQueryTwo.get('rateReadingType')?.disable()
          this.tariffsQueryTwo.get('rateReadingType')?.setValue('0')
          this.resetThreeForm()
          break; 
        }
        case 'warmth': {
          console.log('disabled Währme')
          this.tariffsQueryTwo.get('consumNt')?.enable()
          this.tariffsQueryTwo.get('rateType')?.enable()
          this.tariffsQueryTwo.get('rateType')?.setValue('1')
          this.tariffsQueryTwo.get('rateReadingType')?.enable()
          this.tariffsQueryTwo.get('rateReadingType')?.setValue('1')
          this.resetThreeForm()
          break; 
        }
      }
      this.setNetzprovider()
      this.tariffsQueryTwo.get('people')?.reset()
    }
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
    const city = this.tariffsQuery.get('city')?.value?.city
    const consumNt = this.tariffsQueryTwo.get('consumNt')?.value

    data.branch = typeof branchResult === 'string' ? branchResult : branchResult.branch;
    data.type = typeof typeResult === 'string' ? typeResult : typeResult.type || '';
    data.zip = this.tariffsQuery.get('zip')?.value || '';
    data.city = city ? city : ''
    data.consum = this.tariffsQueryTwo.get('consum')?.value || '';

    if (consumNt){
      data.consumNt = consumNt
    } 

    return data
  }

  setBasePrice(rate: BaseRate) {
    if (rate && 'basePriceYear' in rate && 'workPrice' in rate && 'workPriceNt' in rate ) {
      this.tariffsQueryThree.get('basePriceYear')?.setValue(Number(rate.basePriceYear).toFixed(2))
      this.tariffsQueryThree.get('workPrice')?.setValue(Number(rate.workPrice).toFixed(4))
      this.tariffsQueryThree.get('workPriceNt')?.setValue(Number(rate.workPriceNt).toFixed(4))
    }   
  }

  getSelectTypeName(type: 'private' | 'company' | 'weg') {
    if (type && this.typeMap[type]) {
      this.selectTypeName = this.typeMap[type]

      switch (type) {
        case 'private': {
          this.resetThreeForm()
          break;
        }
        case 'company': {
          this.resetThreeForm()
          break;
        }
        case 'weg': {
          this.resetThreeForm()
          break;
        }
      }
    }
  }


  toggleFilter(event: any) {
    //this.modalService.open(EnergyCalcFilterComponent, { modalDialogClass: 'energie-rechner-filter-modal'})
  }

  getTarifs() {
    let ratesData = Object.assign({}, this.getBranch(true), this.getTyp(true), this.getTariffsQuery(), this.getTariffsQueryTwo(), this.getTariffsQueryThree())
    this.energyService.ratesData = ratesData;
  }

  getBranch(returnObj = false): string | { branch: string } {
    const val = this.branchs.get('branch')?.value;
    const branch = val === 'warmth' ? 'electric' : val;

    if (returnObj) {
      return { branch: branch || '' };
    } else {
      return branch || '';
    }
  }

  getTyp(returnObj = false): string | { type: string } {
    const val = this.typs.get('type')?.value;
    if (returnObj) {
      return { type: val || '' };
    }
    return val || '';
  }

  getTariffsQuery() {
    let data: { [key: string]: any } = {};
    Object.entries(this.tariffsQuery.value).forEach(
      ([key, value]) => {
        if (value && key != 'netzProv') {
          if (key == 'city' && typeof value === 'object' && value !== null && 'city' in value) {
            data[key] = value['city']
          } else data[key] = value        
        }
      }
    )
    return data
  }

  getTariffsQueryTwo() {
    let data: { [key: string]: any } = {};
    Object.entries(this.tariffsQueryTwo.value).forEach(
      ([key, value]) => {
        if (value && key != 'people') {
          data[key] = value
        }
      }
    )
    return data
  }

  getTariffsQueryThree() {
    let data: { [key: string]: any } = {};
    Object.entries(this.tariffsQueryThree.value).forEach(
      ([key, value]) => {
        if (value  && key != 'rateName') {
          data[key] = value
        }
      }
    )
    return data
  }

  onConsumChange(value: string) {
    this.onQuery(value).subscribe(() => this.resetThreeForm());
  }

  onConsumNtChange(value: string) {
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
    this.tariffsQuery.get('city')?.reset()
    this.citys = []
    this.tariffsQuery.get('street')?.reset()
    this.streets = []
    this.tariffsQuery.get('houseNumber')?.reset()
    this.tariffsQuery.get('netzProv')?.reset()
    this.netzProviders = []
    this.baseProviders = []
    this.baseRates = []
    this.tariffsQueryThree.reset()

    this.energyService.resetDataRatesForm$.next();
  }

  resetThreeForm() {
    this.baseProviders = []
    this.baseRates = []
    this.tariffsQueryThree.reset()

    this.energyService.resetDataRatesForm$.next();
  }

 
}
