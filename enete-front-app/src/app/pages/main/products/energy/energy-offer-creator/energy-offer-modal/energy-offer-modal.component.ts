import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable, of, OperatorFunction, Subject, switchMap } from 'rxjs';
import { HttpEnergyService } from '../../service/http-energy.service';
import { EnergyService } from '../../service/energy-service.service';
import { City } from '../../types/types';
import saveAs from 'file-saver';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-energy-offer-modal',
  imports: [CommonModule, ReactiveFormsModule, NgbTypeahead],
  templateUrl: './energy-offer-modal.component.html',
  styleUrl: './energy-offer-modal.component.scss'
})
export class EnergyOfferModalComponent {
   
  
  clientContactDetails: FormGroup
  contactPersonDetails: FormGroup
  ratesData:any = {}

  blur$ = new Subject<string>();
  citys: City[] | null = []
  streets = []

  private destroyRef = inject(DestroyRef);
  public activeModal = inject(NgbActiveModal);
  private httpEnergyService =  inject(HttpEnergyService);
  private energyService =  inject(EnergyService)

  constructor() {
    this.ratesData = this.energyService.ratesData
    this.clientContactDetails = this.setClientContactDetailsForm() 
    this.contactPersonDetails = this.setContactPersonDetailsForm()
  }

  ngOnInit(): void {
    
    console.log(this.ratesData)
    this.contactPersonDetails.get('plz')?.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((queryZip) => this.onQuery(queryZip)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (query: any) => {
        this.contactPersonDetails.get('street')?.reset()
        if (query !== false && query.length == 5 && Number(query)) {
          this.contactPersonDetails.get('city')?.disable()
          this.httpEnergyService.getCitiesByZip(query).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
            result => {
              this.citys = result
              if (this.citys && this.citys.length > 0 && 'city' in this.citys[0]) {
                this.contactPersonDetails.get('city')?.setValue(this.citys[0])
              }

              this.contactPersonDetails.get('city')?.enable()
            }
          )
        }
      })

    // Set Street
    this.contactPersonDetails.get('city')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      query => {
        if (query && 'city' in query && 'zip' in query) {
          this.httpEnergyService.getStreets(query.zip, query.city).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
            result => {
              this.streets = result
              //if (this.streets.length > 0 && 'street' in this.streets[0]) this.tariffsQuery.get('street').setValue(this.streets[0])
            }
          )
        }

      }
    )

    // Check Street Valid
    this.blur$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      res => {
        console.log(res)
        let street = this.streets.find(street => street === res)
        if (!street) {
          this.contactPersonDetails.get('street')?.setValue('')
        }
      }
    )
  }


  close() {
    this.activeModal.dismiss('Cross click')
  }

  setContactPersonDetailsForm() {
    const group: any = {}
    group.company = new FormControl('', [Validators.pattern('[0-9A-z,ÖöÜüÄäß\.\/&\_\'-\\s]*'), Validators.maxLength(254)])
    group.salutation = new FormControl('Anrede')
    group.firstName = new FormControl('', [Validators.pattern('[0-9A-z,ÖöÜüÄäß\.\/&\_\'\\s-]*'), Validators.maxLength(254)])
    group.lastName = new FormControl('', [Validators.pattern('[0-9A-z,ÖöÜüÄäß\.\/&\_\'\\s-]*'), Validators.maxLength(254)])
    group.plz = new FormControl('', [Validators.pattern('[0-9]+'), Validators.minLength(5)])
    group.city = new FormControl('')
    group.street = new FormControl('')
    group.HouseNumber = new FormControl('', [Validators.pattern('[0-9A-z,ÖöÜüÄäß\.\/&\_\'\\s-]*'), Validators.maxLength(254)])
    group.phonePrefix = new FormControl('',[Validators.pattern('[0-9]+'), Validators.maxLength(254)])
    group.phone = new FormControl('', [Validators.pattern('[0-9]+'), Validators.maxLength(254)])
    group.faxPrefix = new FormControl('', [Validators.pattern('[0-9]+'), Validators.maxLength(254)])
    group.fax = new FormControl('', [Validators.pattern('[0-9]+'), Validators.maxLength(254)])
    group.mobilePrefix = new FormControl('', [Validators.pattern('[0-9]+'), Validators.maxLength(254)])
    group.mobile = new FormControl('', [Validators.pattern('[0-9]+'), Validators.maxLength(254)])
    group.email = new FormControl('',[Validators.email])

    return new FormGroup(group)
  }

  setClientContactDetailsForm() {
    const group: any = {}
    group.company = new FormControl('', [Validators.pattern('[0-9A-z,ÖöÜüÄäß\.\/&\_\'\\s-]*'), Validators.maxLength(254)])
    group.salutation = new FormControl('Anrede')
    group.firstName = new FormControl('', [Validators.pattern('[0-9A-z,ÖöÜüÄäß\.\/&\_\'\\s-]*'), Validators.maxLength(254)])
    group.lastName = new FormControl('', [Validators.pattern('[0-9A-z,ÖöÜüÄäß\.\/&\_\'\\s-]*'), Validators.maxLength(254)])
    group.plz = new FormControl({ value: 'zip' in this.ratesData ? this.ratesData.zip : '', disabled: true }, [Validators.pattern('[0-9]+'), Validators.minLength(5)])
    group.city = new FormControl({ value: 'city' in this.ratesData ? this.ratesData.city : '', disabled: true })
    group.street = new FormControl({ value: 'street' in this.ratesData ? this.ratesData.street : '', disabled: true })
    group.HouseNumber = new FormControl({ value: 'houseNumber' in this.ratesData ? this.ratesData.houseNumber :'', disabled: true })
    group.providerName = new FormControl(false)

    return new FormGroup(group)
  }



  // search Street
  search: OperatorFunction<string, string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.streets.filter((v:string) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  onQuery(query: string): Observable<any> {
    if (query != null) {
      return of(query)
    } else {
      return of(false)
    }
  }


  downloadPdf() {
    let PdfData: {
      client?: {
        plz?: string,
        city?: string,
        street: string,
        HouseNumber: string,
      },
      seller?: {},
      offers?: {},
      ratesData?: {},
      filterData?: {}
    } = {}

    if (this.clientContactDetails.valid && this.contactPersonDetails.valid) {
      PdfData.client = this.clientContactDetails.value
      if(PdfData.client){
        PdfData.client.plz = this.clientContactDetails.get('plz')?.value
        PdfData.client.city = this.clientContactDetails.get('city')?.value
        PdfData.client.street = this.clientContactDetails.get('street')?.value
        PdfData.client.HouseNumber = this.clientContactDetails.get('HouseNumber')?.value
        PdfData.seller = this.contactPersonDetails.value
        PdfData.offers = this.energyService.getOffers()
        PdfData.ratesData = this.energyService.ratesData
        PdfData.filterData = this.energyService.filterData
      }
      
      console.log(PdfData)
      // this.httpEnergyService.getPdfOffer(PdfData).subscribe(

      //   (data: Blob) => {
      //     var file = new Blob([data], { type: 'application/pdf' })
      //     var fileURL = URL.createObjectURL(file)
      //     saveAs(fileURL, 'Angebot.pdf')

      //   }
      // )
    } else {
      console.log(this.clientContactDetails)
    } 
  }



  ngOnDestroy() {
    
  }
}
