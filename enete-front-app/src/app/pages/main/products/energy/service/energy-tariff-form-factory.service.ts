import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EnergyTariffFormFactoryService {

  constructor(private fb: FormBuilder) { }

  createCombinedForm(): FormGroup {
    return this.fb.group({
      branch: new FormControl<'electric' | 'gas' | 'warmth'>('electric', Validators.required),
      type: new FormControl<'private' | 'company' | 'weg'>('private', Validators.required),
      tariffsQuery: this.fb.group({
        zip: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5)]],
        city: [null, Validators.required],
        street: ['', Validators.required],
        houseNumber: ['', Validators.required],
        netzProv: [null, Validators.required]
      }),
      tariffsQueryTwo: this.fb.group({
        people: [''],
        consum: ['', [Validators.required, Validators.pattern('[0-9]+')]],
        consumNt: [{ value: '', disabled: true }, Validators.pattern('[0-9]+')],
        rateType: [{ value: '0', disabled: true }],
        rateReadingType: [{ value: '0', disabled: true }]
      }),
      tariffsQueryThree: this.fb.group({
        providerName: [''],
        rateName: [''],
        basePriceYear: ['', Validators.pattern('[0-9,/.]+')],
        workPrice: ['', Validators.pattern('[0-9,/.]+')],
        workPriceNt: ['', Validators.pattern('[0-9,/.]+')]
      })
    });
  }

  createBranchForm(): FormGroup {
    return this.fb.group({
      branch: new FormControl<'electric' | 'gas' | 'warmth'>('electric', Validators.required)
    });
  }

  createTypeForm(): FormGroup {
    return this.fb.group({
      type: new FormControl<'private' | 'company' | 'weg'>('private', Validators.required)
    });
  }

  createTariffsQueryForm(): FormGroup {
    return this.fb.group({
      zip: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5)]],
      city: [null, Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      netzProv: [null, Validators.required]
    });
  }

  createTariffsQueryTwoForm(): FormGroup {
    return this.fb.group({
      people: [''],
      consum: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      consumNt: [{ value: '', disabled: true }, Validators.pattern('[0-9]+')],
      rateType: [{ value: '0', disabled: true }],
      rateReadingType: [{ value: '0', disabled: true }]
    });
  }

  createTariffsQueryThreeForm(): FormGroup {
    return this.fb.group({
      providerName: [''],
      rateName: [''],
      basePriceYear: ['', Validators.pattern('[0-9,/.]+')],
      workPrice: ['', Validators.pattern('[0-9,/.]+')],
      workPriceNt: ['', Validators.pattern('[0-9,/.]+')]
    });
  }
}
