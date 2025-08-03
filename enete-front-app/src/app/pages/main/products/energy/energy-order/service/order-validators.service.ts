import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup, Validators } from "@angular/forms";
import { EnergyService } from "../../service/energy-service.service";
import { birthdayValidator } from "../../shared/helpers/validators/birthdayValidator";
import { compareValidator } from "../../shared/helpers/validators/compareValidator";
import { dateValidator } from "../../shared/helpers/validators/dateValidator";


@Injectable({ providedIn: 'root' })
export class OrderValidatorsService {
  PersonalDataForm!: FormGroup;
  BanckDataForm!: FormGroup;            // Beibehaltung des Namens wegen bestehender Verwendungen
  DifferentAdressForm!: FormGroup;      // dito
  PreSupplierData!: FormGroup;
  ContractFinalForm!: FormGroup;

  isCompany = false;
  EmailRequired = false;
  selfPayment = false;
  differentAddress = false;
  differentAddressIsCompany = false;

  isChangeFastOption = false;
  invoiceByPost = false;

  minChangeDate!: Date;
  minChangeDays!: number;
  maxChangeDate!: Date;
  minMoveInDate!: Date;
  maxMoveInDate!: Date;
  minTerminatedDate!: Date;
  minTerminatedDays!: number;
  maxTerminatedDate!: Date;
  maxSignatureDays!: number;
  minSignatureDays!: number;
  maxSignatureDate!: Date;
  minSignatureDate!: Date;

  constructor(private energyService: EnergyService) {
    const d = this.energyService.getDatesForPreSuppler();
    this.minChangeDate = d.minChangeDate;
    this.minChangeDays = d.minChangeDays;
    this.maxChangeDate = d.maxChangeDate;
    this.minMoveInDate = d.minMoveInDate;
    this.maxMoveInDate = d.maxMoveInDate;
    this.minTerminatedDate = d.minTerminatedDate;
    this.minTerminatedDays = d.minTerminatedDays;
    this.maxTerminatedDate = d.maxTerminatedDate;
    this.maxSignatureDays = d.maxSignatureDays;
    this.minSignatureDays = d.minSignatureDays;
    this.maxSignatureDate = d.maxSignatureDate;
    this.minSignatureDate = d.minSignatureDate;
    this.isChangeFastOption = d.isChangeFastOption;
    this.invoiceByPost = d.invoiceByPost;
  }

  setForms(personal: FormGroup, bank: FormGroup, different: FormGroup, pre: FormGroup, final: FormGroup) {
    this.PersonalDataForm = personal;
    this.BanckDataForm = bank;
    this.DifferentAdressForm = different;
    this.PreSupplierData = pre;
    this.ContractFinalForm = final;
  }

  setSelfPayment(val: boolean) {
    this.selfPayment = !!val;
    this.BankDataValidators();
  }

  setDifferentAdress(val: boolean) {
    this.differentAddress = !!val;
    this.DifferentAdressValidators();
  }

  setDifferentAdressIsCompany(val: boolean) {
    this.differentAddressIsCompany = !!val;
    this.DifferentAdressValidators();
  }

  setValidators(emailRequired: boolean | null, isCompany: boolean) {
    this.EmailRequired = !!emailRequired;
    this.isCompany = !!isCompany;

    this.PersonalDataValidators();
    this.BankDataValidators();
    this.DifferentAdressValidators();
    this.PreSupplierValidators();
    this.ContractFinalValidators();
  }

  updatePreSupplierValidators()  { this.PreSupplierValidators(); }
  updatePersonalDataValidators() { this.PersonalDataValidators(); }
  updateBanckValidators()        { this.BankDataValidators(); }
  updateDifferentAdressValidators(){ this.DifferentAdressValidators(); }
  updateContractFinalValidators(){ this.ContractFinalValidators(); }

  // ------------------ Personal ------------------------------------------------

  private setCtl(c: AbstractControl | null, validators: any[]) {
    if (!c) return;
    c.setValidators(validators);
    c.updateValueAndValidity();
  }

  private clearCtl(c: AbstractControl | null) {
    if (!c) return;
    c.clearValidators();
    c.updateValueAndValidity();
  }

  PersonalDataValidators() {
    const f = this.PersonalDataForm;
    if (!f) return;

    if (this.isCompany) {
      this.setCtl(f.get('company'), [Validators.required, Validators.maxLength(254)]);
      this.setCtl(f.get('legalFormConpany'), [Validators.required, Validators.maxLength(254), Validators.pattern('^(?!keine).+')]);
    } else {
      this.setCtl(f.get('company'), [Validators.maxLength(254)]);
      this.setCtl(f.get('legalFormConpany'), [Validators.maxLength(254), Validators.pattern('^(?!keine).+')]);
    }

    this.setCtl(f.get('salutation'), [Validators.required, Validators.pattern('(Herr|Frau)')]);
    this.setCtl(f.get('title'), [Validators.maxLength(254)]);
    this.setCtl(f.get('firstName'), [Validators.required, Validators.pattern('^[ A-Za-zÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('lastName'),  [Validators.required, Validators.pattern('^[ A-Za-zÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('birthDate'), [Validators.required, birthdayValidator(18)]);
    this.setCtl(f.get('country'),   [Validators.required, Validators.maxLength(254)]);
    this.setCtl(f.get('plz'),       [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5), Validators.maxLength(254)]);
    this.setCtl(f.get('city'),      [Validators.required, Validators.maxLength(254)]);
    this.setCtl(f.get('street'),    [Validators.required, Validators.maxLength(254)]);
    this.setCtl(f.get('HouseNumber'), [Validators.required, Validators.maxLength(254)]);

    const email = f.get('email');
    const emailConfirm = f.get('emailConfirm');

    if (this.EmailRequired) {
      this.setCtl(email, [Validators.required, Validators.email, compareValidator(emailConfirm!, true)]);
      this.setCtl(emailConfirm, [compareValidator(email!)]);
    } else {
      this.setCtl(email, [Validators.email, compareValidator(emailConfirm!, true)]);
      this.setCtl(emailConfirm, [compareValidator(email!)]);
    }

    this.setCtl(f.get('phonePrefix'), [Validators.pattern('[0-9]*'), Validators.required, Validators.maxLength(5)]);
    this.setCtl(f.get('phoneNumber'), [Validators.pattern('[0-9]*'), Validators.required, Validators.maxLength(254)]);
    this.setCtl(f.get('mobilPrefix'), [Validators.pattern('[0-9]*'), Validators.maxLength(5)]);
    this.setCtl(f.get('mobilNumber'), [Validators.pattern('[0-9]*'), Validators.maxLength(254)]);
  }

  // ------------------ Bank / SEPA --------------------------------------------

  BankDataValidators() {
    const f = this.BanckDataForm;
    if (!f) return;

    if (this.selfPayment) {
      // bei Selbstzahler werden Feld-Validatoren entfernt
      f.clearValidators();
      f.updateValueAndValidity();
      return;
    }

    this.setCtl(f.get('salutation'), [Validators.required, Validators.pattern('(Herr|Frau)'), Validators.maxLength(254)]);
    this.setCtl(f.get('firstName'), [Validators.required, Validators.pattern('^[ A-Za-zÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('lastName'),  [Validators.required, Validators.pattern('^[ A-Za-zÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('plz'),       [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5)]);
    this.setCtl(f.get('city'),      [Validators.required, Validators.pattern('^[ A-Za-zÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('street'),    [Validators.required, Validators.pattern('^[A-Za-z ÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('HouseNumber'), [Validators.required, Validators.maxLength(254)]);
    this.setCtl(f.get('BankAccountNumber'), [Validators.required, Validators.pattern('[0-9]+')]);
    this.setCtl(f.get('blz'), [Validators.required]);
    this.setCtl(f.get('iban'), [Validators.required, Validators.minLength(22), Validators.pattern('^DE[0-9]{20}$')]);
    this.setCtl(f.get('bic'), [Validators.required]);
    this.setCtl(f.get('ibanChecked'), [Validators.requiredTrue]);
  }

  // ------------------ Different address --------------------------------------

  DifferentAdressValidators() {
    const f = this.DifferentAdressForm;
    if (!f) return;

    if (!this.differentAddress) {
      // keine Pflichtfelder nötig
      f.updateValueAndValidity();
      return;
    }

    // Firma optional/pflicht je nach Checkbox
    this.setCtl(f.get('company'),
      this.differentAddressIsCompany
        ? [Validators.required, Validators.maxLength(254)]
        : [Validators.maxLength(254)]
    );
    this.setCtl(f.get('salutation'), [Validators.required, Validators.pattern('(Herr|Frau)'), Validators.maxLength(254)]);
    this.setCtl(f.get('firstName'),  [Validators.required, Validators.pattern('^[ A-Za-zÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('lastName'),   [Validators.required, Validators.pattern('^[ A-Za-zÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('country'), [Validators.required]);
    this.setCtl(f.get('plz'),     [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5)]);
    this.setCtl(f.get('city'),    [Validators.required, Validators.pattern('^[ A-Za-zÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('street'),  [Validators.required, Validators.pattern('^[A-Za-z ÖöÜüÄäß-]+$'), Validators.maxLength(254)]);
    this.setCtl(f.get('HouseNumber'), [Validators.required, Validators.maxLength(254)]);
  }

  // ------------------ Pre-Supplier -------------------------------------------

  PreSupplierValidators() {
    const f = this.PreSupplierData;
    if (!f) return;

    const moveOrChange = f.get('moveOrChangeOption')?.value as 'change'|'move';

    // immer gültig
    this.setCtl(f.get('moveInDate'), [dateValidator.dateMinimum(this.minMoveInDate), dateValidator.dateMaximum(this.maxMoveInDate)]);
    this.setCtl(f.get('meterNumber'), [Validators.required, Validators.pattern('^[ \\/\\.0-9A-Za-zÖöÜüÄäß-]+$')]);
    this.setCtl(f.get('signatureDate'), [Validators.required, dateValidator.dateMinimum(this.minSignatureDate), dateValidator.dateMaximum(this.maxSignatureDate)]);
    this.setCtl(f.get('revoke'), [Validators.requiredTrue]);

    const providerChangeDate = f.get('providerChangeDate');
    const terminatedDate     = f.get('terminatedDate');
    const preSupplier        = f.get('preSupplier');
    const prevCustomer       = f.get('previousCustomerNumber');
    const providerChangeFast = f.get('providerChangeFast');
    const isTerminated       = f.get('isAlreadyTerminated');

    if (moveOrChange === 'move') {
      // Einzug: moveInDate required, rest disabled/ohne Pflicht
      f.get('moveInDate')?.addValidators(Validators.required);
      f.get('moveInDate')?.updateValueAndValidity();

      this.clearAndDisable(providerChangeDate);
      this.clearAndDisable(terminatedDate);
      this.clearAndDisable(preSupplier);
      this.clearAndDisable(prevCustomer);
      this.disableOnly(providerChangeFast);
      this.disableOnly(isTerminated);
    } else {
      // Wechsel
      this.enableOnly(providerChangeFast);
      this.enableOnly(providerChangeDate);
      this.enableOnly(preSupplier);
      this.enableOnly(prevCustomer);
      this.enableOnly(isTerminated);
      this.enableOnly(terminatedDate);

      // Basispflichten
      this.setCtl(providerChangeDate, [dateValidator.dateMinimum(this.minChangeDate), dateValidator.dateMaximum(this.maxChangeDate)]);
      this.setCtl(preSupplier, [Validators.required]);
      this.setCtl(prevCustomer, [Validators.required, Validators.pattern('^[ \\/\\.0-9A-Za-zÖöÜüÄäß-]+$')]);

      if (providerChangeFast?.value === true) {
        // schnellstmöglich: kein Wunschdatum, keine Kündigungsangabe
        this.clearAndDisable(providerChangeDate, true);
        this.disableOnly(isTerminated);
        this.clearAndDisable(terminatedDate);
      } else {
        // Wunschdatum möglich
        this.enableOnly(providerChangeDate);
        this.enableOnly(isTerminated);

        if (isTerminated?.value === true) {
          // Kündigungsdatum Pflicht, Wunschdatum deaktiviert
          this.setCtl(terminatedDate, [Validators.required, dateValidator.dateMinimum(this.minTerminatedDate), dateValidator.dateMaximum(this.maxTerminatedDate)]);
          this.clearAndDisable(providerChangeDate, true);
          this.disableOnly(providerChangeFast);
        } else {
          // kein Kündigungsdatum, Wunschdatum optional/erlaubt
          this.clearAndDisable(terminatedDate);
          this.enableOnly(providerChangeDate);
        }
      }
    }
  }

  private clearAndDisable(c: AbstractControl | null, keepValue = false) {
    if (!c) return;
    c.clearValidators();
    if (!keepValue) c.setValue(null);
    c.disable({ emitEvent: false });
    c.updateValueAndValidity();
  }
  private enableOnly(c: AbstractControl | null) {
    if (!c) return;
    c.enable({ emitEvent: false });
    c.updateValueAndValidity();
  }
  private disableOnly(c: AbstractControl | null) {
    if (!c) return;
    c.disable({ emitEvent: false });
    c.updateValueAndValidity();
  }

  // ------------------ Contract final -----------------------------------------

  ContractFinalValidators() {
    const f = this.ContractFinalForm;
    if (!f) return;

    const type = f.get('contractType')?.value as 'non'|'digital'|'pdf';

    const agb = f.get('agb');
    const rev = f.get('revocation');
    const all = f.get('allDataCorrect');

    if (type === 'pdf') {
      this.setCtl(agb, [Validators.requiredTrue]);
      this.setCtl(rev, [Validators.requiredTrue]);
      this.setCtl(all, [Validators.requiredTrue]);
    } else {
      this.clearCtl(agb);
      this.clearCtl(rev);
      this.clearCtl(all);
    }
  }

  resetFormMoveOrChange() {
    const f = this.PreSupplierData;
    const mode = f.get('moveOrChangeOption')?.value;
    if (mode === 'move') {
      f.get('providerChangeFast')?.setValue(false, { emitEvent: false });
      f.get('providerChangeDate')?.setValue(null);
      f.get('preSupplier')?.setValue(null);
      f.get('previousCustomerNumber')?.setValue(null);
      f.get('isAlreadyTerminated')?.setValue(false);
    } else if (mode === 'change') {
      f.get('moveInDate')?.setValue(null);
    }
  }
}
