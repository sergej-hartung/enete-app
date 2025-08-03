import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-personal-data-step',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './personal-data-step.component.html',
  styleUrls: ['./personal-data-step.component.scss'],
})
export class PersonalDataStepComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() type: 'private' | 'company' | string = 'private';
  @Input() legalForm: any[] = [];

  @Input() nextStepStatus = true;
  @Input() backStepStatus = true;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  ngOnInit(): void {
    this.syncCompanyFields();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] && !changes['type'].firstChange) {
      this.syncCompanyFields();
    }
  }

  nextStep(): void {
    this.next.emit();
  }

  backStep(): void {
    this.back.emit();
  }

  /**
   * Aktiviert/Deaktiviert Firmenfelder abhängig von "type".
   * HTML/Control-Namen bleiben unverändert (Kompatibilität!).
   */
  private syncCompanyFields(): void {
    const companyCtl = this.form.get('company');
    const legalFormCtl = this.form.get('legalFormConpany');

    if (!companyCtl || !legalFormCtl) return;

    if (this.type === 'company') {
      companyCtl.enable({ emitEvent: false });
      legalFormCtl.enable({ emitEvent: false });
    } else {
      // Für Privatkunden Felder sperren & zurücksetzen
      companyCtl.reset('', { emitEvent: false });
      companyCtl.disable({ emitEvent: false });

      legalFormCtl.reset('keine gewählt', { emitEvent: false });
      legalFormCtl.disable({ emitEvent: false });
    }
  }
}