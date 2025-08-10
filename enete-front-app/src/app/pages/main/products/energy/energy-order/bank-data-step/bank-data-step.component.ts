import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HttpEnergyService } from "../../service/http-energy.service";
import { OrderValidatorsService } from "../service/order-validators.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-bank-data-step',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './bank-data-step.component.html',
  styleUrls: ['./bank-data-step.component.scss']
})
export class BankDataStepComponent implements OnInit, OnDestroy {
  
private destroyRef = inject(DestroyRef);

  @Input() BankDataForm!: FormGroup;
  @Input() PersonalDataForm!: FormGroup;
  @Input() DifferentAdressForm!: FormGroup;

  @Input() nextStepStatus = true;
  @Input() backStepStatus = true;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  // UI-States (Template erwartet genau diese Namen)
  selfPayment = false;
  differentAddress = false;
  isCompany = false;
  isCheckIban = false;

  constructor(
    private http: HttpEnergyService,
    private orderValidatorsService: OrderValidatorsService
  ) {}

  // ---------- Lifecycle ----------
  ngOnInit(): void {
    if (!this.BankDataForm || !this.PersonalDataForm || !this.DifferentAdressForm) return;

    // Initiale Status-Ermittlung
    this.checkSelfPayment();
    this.checkIsAdressDifferent();
    this.checkIsCompany();
    this.ibanChecked();

    // SelfPayment toggeln
    const selfPaymentCtl = this.BankDataForm.get('SelfPayment');
    if (selfPaymentCtl) {
      selfPaymentCtl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((val: boolean) => {
          this.selfPayment = !!val;
          this.orderValidatorsService.setSelfPayment(this.selfPayment);
          this.toggleBankDataForm();
        });
    }

    // Abweichende Rechnungsadresse toggeln
    const isAddrDiffCtl = this.DifferentAdressForm.get('isAdressDifferent');
    if (isAddrDiffCtl) {
      isAddrDiffCtl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((val: boolean) => {
          this.differentAddress = !!val;
          this.toggleDifferentAdressForm();
          this.orderValidatorsService.setDifferentAdress(this.differentAddress);
        });
    }

    // Rechnungsadresse: Firmenkunde toggeln
    const isCompanyCtl = this.DifferentAdressForm.get('isCompany');
    console.log(isCompanyCtl)
    if (isCompanyCtl) {
      isCompanyCtl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((val: boolean) => {
          this.isCompany = !!val;
          this.checkIsCompany();
          this.orderValidatorsService.setDifferentAdressIsCompany(this.isCompany);
        });
    }

    // IBAN geändert → zurücksetzen der Prüfergebnisse
    const ibanCtl = this.BankDataForm.get('iban');
    if (ibanCtl) {
      ibanCtl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.isCheckIban = false;
          this.setValueIfExists(this.BankDataForm, 'ibanChecked', false);
          this.resetAndDisableIfExists(this.BankDataForm, 'BankAccountNumber', true);
          this.resetAndDisableIfExists(this.BankDataForm, 'blz', true);
          this.resetAndDisableIfExists(this.BankDataForm, 'bic', true);
        });
    }

    // Initiale UI-Sperren anwenden
    this.toggleBankDataForm();
    this.toggleDifferentAdressForm();
  }

  ngOnDestroy(): void {

  }

  // ---------- Navigation ----------
  nextStep(): void {
    this.next.emit();
  }

  backStep(): void {
    this.back.emit();
  }

  // ---------- Actions ----------
  checkIban(): void {
    const iban = this.BankDataForm?.get('iban')?.value;
    if (!iban) return;
    console.log(iban)
    this.http
      .checkIban(iban)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        console.log(res)
        if (res && 'error' in res && res.error) {
          // Fehlermarker am Control setzen
          this.BankDataForm.get('iban')?.setErrors({ checkError: true });
          this.isCheckIban = false;
          this.setValueIfExists(this.BankDataForm, 'ibanChecked', false);
        } else {
          // Daten aus der IBAN-Prüfung übernehmen
          this.setBankData(res);
          this.isCheckIban = true;
          this.setValueIfExists(this.BankDataForm, 'ibanChecked', true);
        }
      });
  }

  setBaseData(): void {
    // Überträgt Stammdaten aus PersonalData in BankData (gleichlautende Felder)
    this.copyValue('salutation', this.PersonalDataForm, this.BankDataForm);
    this.copyValue('firstName', this.PersonalDataForm, this.BankDataForm);
    this.copyValue('lastName', this.PersonalDataForm, this.BankDataForm);
    this.copyValue('plz', this.PersonalDataForm, this.BankDataForm);
    this.copyValue('city', this.PersonalDataForm, this.BankDataForm);
    this.copyValue('street', this.PersonalDataForm, this.BankDataForm);
    this.copyValue('HouseNumber', this.PersonalDataForm, this.BankDataForm);

    // Falls SelfPayment aktiv war, ist das Feld deaktiviert → hier nicht re-enablen.
  }

  // ---------- Helpers (Form/State) ----------
  private toggleBankDataForm(): void {
    if (!this.BankDataForm) return;

    // Bei Selbstzahlung alle Bankfelder (außer SelfPayment) leeren & deaktivieren
    if (this.selfPayment) {
      Object.keys(this.BankDataForm.controls).forEach((key) => {
        if (key === 'SelfPayment') return;
        const ctl = this.BankDataForm.get(key)!;
        ctl.reset();
        ctl.disable({ emitEvent: false });
      });
      return;
    }

    // SEPA: relevante Felder aktivieren (BankAccountNumber/blz/bic bleiben read-only aus IBAN-Check)
    Object.keys(this.BankDataForm.controls).forEach((key) => {
      if (['SelfPayment', 'BankAccountNumber', 'blz', 'bic'].includes(key)) return;
      const ctl = this.BankDataForm.get(key)!;
      ctl.enable({ emitEvent: false });
      if (key === 'salutation' && !ctl.value) {
        ctl.setValue('Anrede', { emitEvent: false });
      }
    });
  }

  private toggleDifferentAdressForm(): void {
    if (!this.DifferentAdressForm) return;

    // Wenn keine abweichende Adresse → alles (außer Flags/Land/Company) leeren & deaktivieren
    if (!this.differentAddress) {
      Object.keys(this.DifferentAdressForm.controls).forEach((key) => {
        if (['isAdressDifferent', 'country', 'company'].includes(key)) return;
        const ctl = this.DifferentAdressForm.get(key)!;
        ctl.reset();
        ctl.disable({ emitEvent: false });
      });
      return;
    }

    // Abweichende Adresse aktiv → aktivieren (außer 'country' ist bereits enabled)
    Object.keys(this.DifferentAdressForm.controls).forEach((key) => {
      if (['isAdressDifferent', 'country', 'company'].includes(key)) return;
      const ctl = this.DifferentAdressForm.get(key)!;
      ctl.enable({ emitEvent: false });
      if (key === 'salutation' && !ctl.value) {
        ctl.setValue('Anrede', { emitEvent: false });
      }
    });
  }

  private setBankData(data: any): void {
    // Erwartete Keys vom IBAN-Check (entsprechen deinem bisherigen Code)
    if (!this.BankDataForm) return;
    if (data?.bankAccountNumber != null) {
      this.setValueIfExists(this.BankDataForm, 'BankAccountNumber', data.bankAccountNumber, true);
    }
    if (data?.bankIdentifierCode != null) {
      this.setValueIfExists(this.BankDataForm, 'blz', data.bankIdentifierCode, true);
    }
    if (data?.bic != null) {
      this.setValueIfExists(this.BankDataForm, 'bic', data.bic, true);
    }
  }

  private checkSelfPayment(): void {
    const val = this.BankDataForm?.get('SelfPayment')?.value;
    this.selfPayment = val === true;
  }

  private checkIsAdressDifferent(): void {
    const val = this.DifferentAdressForm?.get('isAdressDifferent')?.value;
    this.differentAddress = val === true;
  }

  private checkIsCompany(): void {
    const ctl = this.DifferentAdressForm?.get('isCompany');
    this.isCompany = ctl?.value === true;

    const companyCtl = this.DifferentAdressForm?.get('company');
    if (!companyCtl) return;

    if (this.isCompany) {
      companyCtl.enable({ emitEvent: false });
    } else {
      companyCtl.reset('', { emitEvent: false });
      companyCtl.disable({ emitEvent: false });
    }
  }

  private ibanChecked(): void {
    const val = this.BankDataForm?.get('ibanChecked')?.value;
    this.isCheckIban = val === true;
  }

  // ---------- Tiny utilities ----------
  private copyValue(controlName: string, from: FormGroup, to: FormGroup): void {
    const src = from.get(controlName);
    const dst = to.get(controlName);
    if (src && dst && !dst.disabled) {
      dst.setValue(src.value, { emitEvent: false });
      dst.markAsDirty();
      dst.markAsTouched();
    }
  }

  private setValueIfExists(form: FormGroup, name: string, value: any, keepDisabled = false): void {
    const ctl = form.get(name);
    if (!ctl) return;

    const wasDisabled = ctl.disabled;
    if (wasDisabled && !keepDisabled) ctl.enable({ emitEvent: false });
    ctl.setValue(value, { emitEvent: false });
    if (wasDisabled && !keepDisabled) ctl.disable({ emitEvent: false });
  }

  private resetAndDisableIfExists(form: FormGroup, name: string, disable = false): void {
    const ctl = form.get(name);
    if (!ctl) return;
    ctl.reset('', { emitEvent: false });
    if (disable) ctl.disable({ emitEvent: false });
  }
}