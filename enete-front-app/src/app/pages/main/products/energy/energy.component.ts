import { Component, DestroyRef, HostBinding, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../main-layout/breadcrumbs/breadcrumbs.component';
import { EnergyTariffFormComponent } from './energy-tariff-form/energy-tariff-form.component';
import { EnergyTariffsComponent } from './energy-tariffs/energy-tariffs.component';
import { HttpEnergyService } from './service/http-energy.service';
import { EnergyService, Offer } from './service/energy-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { LinearLoaderComponent } from '../../../../core/shared/helpers/linear-loader/linear-loader.component';
import { EnergyOfferCreatorComponent } from './energy-offer-creator/energy-offer-creator.component';
import { EnergyOrderEntryComponent } from './energy-order/energy-order-entry.component';

@Component({
  selector: 'app-energy',
  imports: [
    CommonModule,
    BreadcrumbsComponent, 
    EnergyTariffFormComponent, 
    EnergyTariffsComponent,
    LinearLoaderComponent,
    EnergyOfferCreatorComponent,
    EnergyOrderEntryComponent
  ],
  templateUrl: './energy.component.html',
  styleUrl: './energy.component.scss',
  host: {
    'class': 'content_rechner'
  }
})
export class EnergyComponent {

  filterData:any = {}
  ratesData:any = {}
  priceData: any = ''
  priceIncludingBonus: any = false
  isLoadedRates = true

  ratesServer = []
  rates = []
  offers: Offer[] = []

  show = true
  isOrderFinish = false



  private destroyRef = inject(DestroyRef);
  private httpEnergieService = inject(HttpEnergyService);
  private energyService = inject(EnergyService);

  @HostBinding('class.content_rechner') energyRechnerClass: boolean = true;
  @HostBinding('class.content_energie_order_entry') energyOrderClass: boolean = false

  constructor() { 
    this.offers = this.energyService.getOffers()
  }

  ngOnInit() {

    this.energyService.filterModifi$.subscribe(
      event => {
        console.log('filter Modify')
        console.log(this.energyService.filterData)
        this.setFilterData()
        
        if (Object.keys(this.ratesData).length > 0) {
          this.energyService.resetOffers()
          this.getRates()
        }
        
        console.log(this.filterData)
        console.log(this.ratesData)
        console.log(this.priceIncludingBonus)
        console.log(this.rates)
        console.log(this.ratesServer)
      }
    )


    this.energyService.toggleOrderEntry$.subscribe(
      event => {
        console.log(event)
        if (Object.keys(event).length > 0) {
          this.show = false
          this.energyRechnerClass = this.show
          this.energyOrderClass = !this.show
        } else {
          this.show = true
          this.energyRechnerClass = this.show
          this.energyOrderClass = !this.show
        }

        console.log(this.show)
        console.log(this.energyRechnerClass)
        console.log(this.energyOrderClass)
      }
    )

    this.energyService.resetDataRatesForm$.subscribe(
      event => {
        this.ratesData = {}
        this.rates = []
        this.ratesServer = []
        this.energyService.resetOffers()
      }
    )

    this.energyService.orderFinished$.subscribe(
      event => {
        this.isOrderFinish = true
      }
    )


    this.energyService.getRates$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(e => {
      console.log(e)
      this.setRatesData()
      this.getRates()
    })

    this.energyService.offers$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(e => {
      console.log(e)
      this.offers = e
    })
  }

  setRatesData() {
    this.ratesData = {}
    this.ratesData = Object.assign({}, this.energyService.ratesData)
    if (this.priceData.length > 0) {
      this.ratesData['priceDate'] = this.priceData
    }
  }


  getRates() {
    this.isLoadedRates = false
    this.rates = []
    this.ratesServer = []
    console.log(this.ratesData)
    console.log(this.filterData)
    this.httpEnergieService.getEnergyRates(this.ratesData, this.filterData).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      res => {
        console.log(res)
        this.ratesServer = res
        this.rates = this.checkTotalPrice(this.ratesServer)
        //this.rates = result
        console.log(res)
        this.isLoadedRates = true
      }
    )
  }

  setFilterData() {
    this.filterData = {}
    this.priceIncludingBonus = false
    this.priceData = ''
    Object.entries(this.energyService.filterData).forEach(
      ([key, value]) => {
        if (key == 'filterBonus') {
          this.priceIncludingBonus = value
        } else if (key == 'priceDate') {
          this.priceData = value
        } else {
          this.filterData[key] = value
        }
      }
    )

    if (this.priceData.length > 0 && Object.keys(this.ratesData).length > 0) {
      this.ratesData['priceDate'] = this.priceData
    }
    if (('priceDate' in this.ratesData) && this.priceData.length == 0) {
      delete this.ratesData['priceDate']
    }
  }

  checkTotalPrice(rates:any) {
    let res:any = []
    rates.forEach((e:any) => {
      if ('totalPrice' in e) {
        let element = Object.assign({}, e)
        element['totalPriceWithoutBonus'] = element.totalPrice
        let price = element.totalPrice
        if (this.priceIncludingBonus) {
          console.log('bonus true')
          if ('optBonus' in element && element.optBonus != 0) {
            price = price - element.optBonus
          }
          if ('optBonusInstant' in element && element.optBonusInstant != 0) {
            price = price - element.optBonusInstant
          }

          element.totalPrice = price
        }
        res.push(element)
      }
    })

    return res.sort((a:any, b:any) => {
      if (a.totalPrice < b.totalPrice) {
        return -1
      }
      if (a.totalPrice > b.totalPrice) {
        return 1
      }

      return 0
    })
  }
}
