import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseProvider, BaseRate } from '../../types/types';


@Component({
  selector: 'app-base-provider-form',
  imports: [CommonModule, ReactiveFormsModule, NgbCollapseModule,],
  templateUrl: './base-provider-form.component.html',
  styleUrl: './base-provider-form.component.scss'
})
export class BaseProviderFormComponent {

  isCollapsed = true

  @Input() formGroup!: FormGroup;
  @Input() baseProviders: BaseProvider[] = [];
  @Input() baseRates: BaseRate[] = [];
  @Input() formReadyToLoad = false;

  @Output() loadProvider = new EventEmitter<void>();
  @Output() resetProvider = new EventEmitter<void>();
  @Output() providerChanged = new EventEmitter<BaseProvider>();
  @Output() rateChanged = new EventEmitter<BaseRate>();

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
