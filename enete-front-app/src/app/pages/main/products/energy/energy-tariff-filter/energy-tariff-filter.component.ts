import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EnergyService } from '../service/energy-service.service';
import { isEqualObjPropertis } from '../shared/helpers/isEqualObjPropertis';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-energy-tariff-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,],
  templateUrl: './energy-tariff-filter.component.html',
  styleUrl: './energy-tariff-filter.component.scss'
})
export class EnergyTariffFilterComponent {
  
  tariffsEnergyFilter = new FormGroup({
    optTerm: new FormControl("false"),
    optGuarantee: new FormControl("false"),
    priceDate: new FormControl(''),
    filterBonus: new FormControl(false),
    providerDigitalSigned: new FormControl(false),
    requiredEmail: new FormControl(false),
    optEco: new FormControl(false),
    selfPayment: new FormControl(false),
    howOnlyFollowUpProvision: new FormControl({ value: false, disabled: true })
  })


  private activeModal = inject(NgbActiveModal);
  private energyService = inject(EnergyService);

  ngOnInit() {
    this.setFilter()
  }

  close() {
    this.activeModal.dismiss('Cross click')
  }

  setFilter() {
    let filterData = Object.assign({}, this.energyService.filterData)
    if (filterData) {
      Object.entries(filterData).forEach(
        ([key, value]) => {
          this.tariffsEnergyFilter?.get(key)?.setValue(value)
        }
      )
    }
  }

  saveDataFilter() {
    let value = Object.assign({}, this.tariffsEnergyFilter.value)
    let filter:any = {}

    if (value) {
      Object.entries(value).forEach(
        ([key, value]) => {
          let val = value != 'false' ? value : false
          if (val) {
            filter[key] = val
          }
        }
      )
    }

    if (!isEqualObjPropertis(filter, this.energyService.filterData)){
      this.energyService.filterData = filter
      this.energyService.filterModifi$.next('')
    }
  }
  

  ngOnDestroy() {
   // console.log(this.tariffsEnergyFilter.value)
    this.saveDataFilter()
  }

}
