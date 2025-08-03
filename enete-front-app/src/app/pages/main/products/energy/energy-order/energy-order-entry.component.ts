import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { formatDateYMD } from './date-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpEnergyService } from '../service/http-energy.service';
import { EnergyService } from '../service/energy-service.service';
import { OrderValidatorsService } from './service/order-validators.service';
import { CommonModule } from '@angular/common';
import { LinearLoaderComponent } from '../../../../../core/shared/helpers/linear-loader/linear-loader.component';
import { PersonalDataStepComponent } from './personal-data-step/personal-data-step.component';

import {
  LegalFormItem,
  OrderEntryRate,
  ProviderItem,
  StepState,
  RatesData
} from './energy-order.models';




@Component({
  selector: 'app-energy-order-entry',
  imports: [
    CommonModule,
    LinearLoaderComponent,
    PersonalDataStepComponent
  ],
  templateUrl: './energy-order-entry.component.html',
  styleUrls: ['./energy-order-entry.component.scss']
})
export class EnergyOrderEntryComponent implements OnInit, OnDestroy {

  private destroyRef = inject(DestroyRef);

  orderEntryRate!: OrderEntryRate;
  activeStep!: StepState;

  steps: StepState[] = [];
  nextStepEnabled = true;
  backStepEnabled = true;

  isFinalStep = false;

  beforeProviders: ProviderItem[] = [];
  legalForms: LegalFormItem[] = [];

  personalDataForm!: FormGroup;
  bankDataForm!: FormGroup;
  differentAddressForm!: FormGroup;
  preSupplierForm!: FormGroup;
  contractFinalForm!: FormGroup;

  type: 'private'|'company' = 'private';
  companyName = '';
  rateName = '';

  //bsModalRef?: BsModalRef;

  // Loader flags
  isBeforeProvidersLoaded = false;
  isLegalFormsLoaded = false;
  isSending = false;

  constructor(
    private httpEnergyService: HttpEnergyService,
    private energyService: EnergyService,
    private validators: OrderValidatorsService,
    //private modalService: BsModalService,
  ) {
    this.orderEntryRate = this.energyService.orderEntryTarif as OrderEntryRate;

    // Forms
    this.personalDataForm = this.createPersonalDataForm();
    this.bankDataForm = this.createBankDataForm();
    this.differentAddressForm = this.createDifferentAddressForm();
    this.preSupplierForm = this.createPreSupplierForm();
    this.contractFinalForm = this.createContractFinalForm();
  }

  ngOnInit(): void {
    this.initSteps();
    this.detectType();

    this.loadBeforeProviders();
    this.loadLegalForms();
    this.extractCompanyName();
    this.extractRateName();

    // validators: attach all forms once
    this.validators.setForms(
      this.personalDataForm,
      this.bankDataForm,
      this.differentAddressForm,
      this.preSupplierForm,
      this.contractFinalForm
    );

    const requiredEmail =
      this.orderEntryRate?.rate?.requiredEmail ?? null;
    const isCompany = this.type === 'company';

    this.validators.setValidators(requiredEmail, isCompany);
  }

  // ---- Setup / helpers ------------------------------------------------------

  private get ratesData(): RatesData {
    return this.energyService.ratesData as RatesData;
  }

  private extractCompanyName(): void {
    this.companyName = this.orderEntryRate?.rate?.providerName ?? '';
  }

  private extractRateName(): void {
    this.rateName = this.orderEntryRate?.rate?.rateName ?? '';
  }

  private detectType(): void {
    const t = this.ratesData?.type;
    if (t === 'company' || t === 'private') this.type = t;
  }

  private initSteps(): void {
    this.steps = [
      { id: 1, name: 'step1', success: true,  error: false },
      { id: 2, name: 'step2', success: false, error: false },
      { id: 3, name: 'step3', success: false, error: false },
      { id: 4, name: 'step4', success: false, error: false },
      { id: 5, name: 'step5', success: false, error: false },
    ];
    // Start bei Step 2, wie in deiner Vorlage
    this.activeStep = this.steps[1];
    this.updateStepButtons();
  }

  // ---- Data loading ---------------------------------------------------------

  private loadLegalForms(): void {
    this.isLegalFormsLoaded = false;
    if (this.type !== 'company') {
      this.isLegalFormsLoaded = true;
      return;
    }
    const rateId = this.orderEntryRate?.rate?.rateId;
    if (!rateId) { this.isLegalFormsLoaded = true; return; }

    this.httpEnergyService.getLegalForm(rateId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (Array.isArray(result) && result.length) {
          this.legalForms = result as LegalFormItem[];
        }
        this.isLegalFormsLoaded = true;
      });
  }

  private loadBeforeProviders(): void {
    this.isBeforeProvidersLoaded = false;
    const rateId = this.orderEntryRate?.rate?.rateId;
    if (!rateId) { this.isBeforeProvidersLoaded = true; return; }

    this.httpEnergyService.getBeforeProvider(rateId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (Array.isArray(result) && result.length) {
          this.beforeProviders = result as ProviderItem[];
        }
        this.isBeforeProvidersLoaded = true;
      });
  }

  // ---- Navigation -----------------------------------------------------------

  getStepById(id: number): void {
    if (id < 1 || id > 5) return;
    this.activeStep = this.steps[id - 1];

    if (id === 1) {
      // Zurück zur Tarifauswahl: Auswahl löschen
      this.energyService.deleteOrderEntryTarif();
    }
    if (id === 5) {
      this.markAllFormsTouched();
    }
    this.recalculateStepStatuses();
    this.updateStepButtons();
  }

  getNextStep(): void {
    const id = this.activeStep.id;
    if (id < 5) this.activeStep = this.steps[id]; // id is 1-based
    this.recalculateStepStatuses();
    this.updateStepButtons();
  }

  getBackStep(): void {
    const id = this.activeStep.id;
    if (id > 1) this.activeStep = this.steps[id - 2];
    this.recalculateStepStatuses();
    this.updateStepButtons();
  }

  private updateStepButtons(): void {
    const id = this.activeStep.id;
    this.backStepEnabled = id !== 1;
    this.nextStepEnabled = id !== 5;
    this.isFinalStep = id === 5;
  }

  private recalculateStepStatuses(): void {
    // Step 2
    if (this.personalDataForm.touched) {
      this.steps[1].error = this.personalDataForm.invalid;
      this.steps[1].success = this.personalDataForm.valid;
    }
    // Step 3
    if (this.bankDataForm.touched || this.differentAddressForm.touched) {
      const hasError = this.bankDataForm.invalid || this.differentAddressForm.invalid;
      const ok = this.bankDataForm.valid && this.differentAddressForm.valid;
      this.steps[2].error = hasError;
      this.steps[2].success = ok;
    }
    // Step 4
    if (this.preSupplierForm.touched) {
      this.steps[3].error = this.preSupplierForm.invalid;
      this.steps[3].success = this.preSupplierForm.valid;
    }
  }

  private markAllFormsTouched(): void {
    [this.personalDataForm, this.bankDataForm, this.differentAddressForm, this.preSupplierForm]
      .forEach(f => { f.markAllAsTouched(); Object.values(f.controls).forEach(c => c.markAllAsTouched()); });
  }

  // ---- Form factories -------------------------------------------------------

  private createPersonalDataForm(): FormGroup {
    const zip    = this.ratesData?.zip ?? '';
    const city   = this.ratesData?.city ?? '';
    const street = this.ratesData?.street ?? '';
    const house  = this.ratesData?.houseNumber ?? '';

    // Validatoren setzt OrderValidatorsService
    return new FormGroup({
      company:            new FormControl(''),
      legalFormConpany:   new FormControl('keine gewählt'),
      salutation:         new FormControl('Anrede'),
      title:              new FormControl('kein Titel'),
      firstName:          new FormControl(''),
      lastName:           new FormControl(''),
      birthDate:          new FormControl(''),
      country:            new FormControl({ value: 'Deutschland', disabled: true }),

      plz:                new FormControl({ value: zip,    disabled: true }),
      city:               new FormControl({ value: city,   disabled: true }),
      street:             new FormControl({ value: street, disabled: true }),
      HouseNumber:        new FormControl({ value: house,  disabled: true }),

      email:              new FormControl(''),
      emailConfirm:       new FormControl(''),

      phonePrefix:        new FormControl(''),
      phoneNumber:        new FormControl(''),
      mobilPrefix:        new FormControl(''),
      mobilNumber:        new FormControl(''),
    });
  }

  private createBankDataForm(): FormGroup {
    const group: Record<string, FormControl> = {};

    if (this.orderEntryRate?.rate?.selfPayment) {
      group['SelfPayment'] = new FormControl(false);
    }

    Object.assign(group, {
      salutation:        new FormControl('Anrede'),
      firstName:         new FormControl(''),
      lastName:          new FormControl(''),
      plz:               new FormControl(''),
      city:              new FormControl(''),
      street:            new FormControl(''),
      HouseNumber:       new FormControl(''),

      BankAccountNumber: new FormControl({ value: '', disabled: true }),
      blz:               new FormControl({ value: '', disabled: true }),
      iban:              new FormControl(''),
      bic:               new FormControl({ value: '', disabled: true }),
      BankName:          new FormControl(''),
      ibanChecked:       new FormControl(false),
    });

    return new FormGroup(group);
  }

  private createDifferentAddressForm(): FormGroup {
    return new FormGroup({
      isAdressDifferent: new FormControl(false),
      isCompany:         new FormControl({ value: false, disabled: true }),

      company:           new FormControl({ value: '', disabled: true }),
      salutation:        new FormControl({ value: 'Anrede', disabled: true }),
      firstName:         new FormControl({ value: '', disabled: true }),
      lastName:          new FormControl({ value: '', disabled: true }),

      country:           new FormControl({ value: 'Deutschland', disabled: true }),
      plz:               new FormControl({ value: '', disabled: true }),
      city:              new FormControl({ value: '', disabled: true }),
      street:            new FormControl({ value: '', disabled: true }),
      HouseNumber:       new FormControl({ value: '', disabled: true }),
    });
  }

  private createPreSupplierForm(): FormGroup {
    return new FormGroup({
      moveOrChangeOption:      new FormControl('change'),
      moveInDate:              new FormControl(),
      providerChangeFast:      new FormControl(false),
      providerChangeDate:      new FormControl(),
      preSupplier:             new FormControl(),
      previousCustomerNumber:  new FormControl(),
      isAlreadyTerminated:     new FormControl(false),
      terminatedDate:          new FormControl(),
      meterNumber:             new FormControl(),
      meloId:                  new FormControl({ value: '', disabled: true }),
      diffMeasurementprovider: new FormControl({ value: '', disabled: true }),
      maloId:                  new FormControl({ value: '', disabled: true }),
      revoke:                  new FormControl(false),
      invoiceByPost:           new FormControl(false),
      signatureDate:           new FormControl(),
    });
  }

  private createContractFinalForm(): FormGroup {
    const rate = this.orderEntryRate?.rate as any;

    const group: Record<string, FormControl> = {
      contractType: new FormControl('non'),
      agb:          new FormControl(),
      revocation:   new FormControl(),
      allDataCorrect: new FormControl(),
    };

    if (rate?.optinAdvertiseEmail)      group['advertiseEmail'] = new FormControl();
    if (rate?.optinAdvertiseMobile)     group['advertiseMobil'] = new FormControl();
    if (rate?.optinAdvertisePersonally) group['advertisePersonally'] = new FormControl();
    if (rate?.optinAdvertisePhone)      group['advertisePhone'] = new FormControl();
    if (rate?.optinAdvertisePost)       group['advertisePost'] = new FormControl();

    return new FormGroup(group);
  }

  // ---- Order payload builders ----------------------------------------------

  private buildDelivery() {
    const r = this.ratesData;
    return {
      country: '81',
      zip: r.zip,
      city: r.city,
      street: r.street,
      houseNumber: r.houseNumber,
    };
  }

  private buildContactPerson() {
    const get = (key: string) => this.personalDataForm.get(key);
    const raw = {
      salutation:   get('salutation')?.value,
      firstName:    get('firstName')?.value,
      lastName:     get('lastName')?.value,
      clientTitle:  get('title')?.value,
      birthday:     get('birthDate')?.value,
    } as Record<string, string>;

    const out: Record<string, string> = {};
    Object.entries(raw).forEach(([k, v]) => {
      if (!v || v === 'kein Titel') return;
      if (k === 'birthday' && v) {
        // erwartet dd.MM.yyyy eingetippt
        const parts = v.split('.');
        if (parts.length === 3) {
          out[k] = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      } else {
        out[k] = (k === 'salutation' && v === 'Anrede') ? '' : v;
      }
    });
    return out;
  }

  private buildContact() {
    const get = (k: string) => this.personalDataForm.get(k)?.value ?? '';
    return {
      email:       get('email'),
      phonePrefix: get('phonePrefix'),
      phoneNumber: get('phoneNumber'),
    };
  }

  private isAlternativeAccountHolder(): boolean {
    const P = (k: string) => this.personalDataForm.get(k)?.value ?? '';
    const B = (k: string) => this.bankDataForm.get(k)?.value ?? '';
    const keys = ['salutation', 'firstName', 'lastName', 'plz', 'city', 'street', 'HouseNumber'];
    return keys.some(k => P(k) !== B(k));
  }

  private buildPayment() {
    const selfPayment = this.bankDataForm.get('SelfPayment')?.value === true;
    const out: any = { paymentType: selfPayment ? 'debit' : 'sepa' };

    if (!selfPayment) {
      out.iban = this.bankDataForm.get('iban')?.value ?? '';
      if (this.isAlternativeAccountHolder()) {
        const v = (k: string) => this.bankDataForm.get(k)?.value;
        out.alternativeAccountHolder = true;
        out.accountHolder = {};
        const map: Record<string,string> = {
          salutation: 'salutation', firstName: 'firstName', lastName: 'lastName',
          country: '81', plz: 'zip', city: 'city', street: 'street', HouseNumber: 'houseNumber'
        };
        Object.entries(map).forEach(([formKey, targetKey]) => {
          const val = formKey === 'country' ? '81' : v(formKey);
          if (val && val !== 'Anrede') out.accountHolder[targetKey] = val;
        });
      }
    }
    return out;
  }

  private buildBilling() {
    const v = (k: string) => this.differentAddressForm.get(k)?.value;
    return {
      salutation:  v('salutation'),
      firstName:   v('firstName'),
      lastName:    v('lastName'),
      country:     81,
      zip:         v('plz'),
      city:        v('city'),
      street:      v('street'),
      houseNumber: v('HouseNumber'),
    };
  }

  private buildProducts() {
    const rate = this.energyService.orderEntryTarif?.rate;
    const rData = this.ratesData;

    const products: any = {
      rateId: rate?.rateId,
      consum: rData.consum,
      branch: rData.branch,
      type:   rData.type,
    };

    if ('consumNt' in rData) products.consumNt = (rData as any).consumNt;

    // signature
    const sig = this.preSupplierForm.get('signatureDate')?.value as Date | null;
    if (sig) products.sigDate = formatDateYMD(sig);

    const mode = this.preSupplierForm.get('moveOrChangeOption')?.value as 'change'|'move';
    const fast = this.preSupplierForm.get('providerChangeFast')?.value === true;
    const melo = this.preSupplierForm.get('meloId')?.value;
    const before = this.preSupplierForm.get('preSupplier')?.value as ProviderItem | null;
    const terminated = this.preSupplierForm.get('isAlreadyTerminated')?.value === true;
    const meter = this.preSupplierForm.get('meterNumber')?.value;
    const prevCustomerId = this.preSupplierForm.get('previousCustomerNumber')?.value;

    if (meter) products.counterNumber = meter;
    if (melo)  products.pointOfDelivery = melo;

    if (mode) products.deliveryType = mode === 'change' ? 'change' : 'new';

    if (mode === 'change') {
      if (prevCustomerId) products.beforeProviderCustomerId = prevCustomerId;
      if (before?.name)   products.beforeProviderName = before.name;
      if (before?.vdew)   products.beforeProviderId = before.vdew;

      if (fast) {
        products.fastDelivery = true;
      } else {
        if (!terminated) {
          const changeDate = this.preSupplierForm.get('providerChangeDate')?.value as Date | null;
          if (changeDate) products.deliveryDate = formatDateYMD(changeDate);
          products.beforeContractTerminated = false;
        } else {
          const terminatedDate = this.preSupplierForm.get('terminatedDate')?.value as Date | null;
          if (terminatedDate) {
            const term = formatDateYMD(terminatedDate);
            const nextDay = new Date(terminatedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            products.beforeContractTerminated = term;
            products.deliveryDate = formatDateYMD(nextDay);
          }
        }
      }
    } else if (mode === 'move') {
      const moveIn = this.preSupplierForm.get('moveInDate')?.value as Date | null;
      if (moveIn) products.deliveryDate = formatDateYMD(moveIn);
    }

    return [products];
  }

  private buildAdvertising() {
    const form = this.contractFinalForm;
    const out = { phone: false, mobil: false, email: false, post: false, personally: false };
    ([
      ['advertisePhone', 'phone'],
      ['advertiseMobil', 'mobil'],
      ['advertiseEmail', 'email'],
      ['advertisePost', 'post'],
      ['advertisePersonally', 'personally'],
    ] as const).forEach(([control, key]) => {
      const c = form.get(control);
      if (c?.value === true) (out as any)[key] = true;
    });
    return out;
  }

  // ---- Submit ---------------------------------------------------------------

  createOrder(parkContract = false): void {
    this.isSending = true;

    const payload: any = {
      delivery: this.buildDelivery(),
      contactPerson: this.buildContactPerson(),
      contact: this.buildContact(),
      payment: this.buildPayment(),
      products: this.buildProducts(),
      advertising: this.buildAdvertising(),
    };

    if (this.type === 'company') payload.company = this.buildCompany();
    if (this.differentAddressForm.get('isAdressDifferent')?.value === true) {
      payload.billing = this.buildBilling();
    }
    if (parkContract) {
      payload.additional = [{ name: 'parked', value: true }];
    }

    // this.httpEnergyService.createOrder(payload)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(result => {
    //     if ((result as any)?.error) {
    //       this.openErrorModal(result);
    //       this.isSending = false;
    //       return;
    //     }
    //     this.energyService.orderFinishData = result;
    //     this.energyService.orderParck = parkContract;
    //     this.isSending = false;
    //     this.energyService.orderFinished.emit();
    //   });
  }

  private buildCompany() {
    const name = this.personalDataForm.get('company')?.value ?? '';
    const legal = this.personalDataForm.get('legalFormConpany')?.value;
    const legalForm = typeof legal === 'object' ? (legal?.legalForm ?? '') : '';

    return {
      name,
      legalForm,
      taxNumber: '',
      branch: '',
      court: '',
      courtNumber: '',
      representativeFunction: '',
      taxSalesId: '',
    };
  }

  private openErrorModal(error: unknown) {
    // const initialState: ModalOptions = {
    //   initialState: {
    //     error,
    //     title: 'Fehler beim Übermitteln!',
    //   }
    // };
    // this.bsModalRef = this.modalService.show(ErrorDataSendModalComponent, initialState);
    // if (this.bsModalRef?.content) (this.bsModalRef.content as any).closeBtnName = 'Ok';
  }

  ngOnDestroy(): void {
    
  }
}
