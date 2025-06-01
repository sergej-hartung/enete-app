import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

interface BaseProvider {
  providerName: string;
  rates?: BaseRate[];
}

interface BaseRate {
  rateName: string;
  basePriceYear: number;
  workPrice: number;
  workPriceNt: number;
}

@Component({
  selector: 'app-base-provider-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './base-provider-form.component.html',
  styleUrl: './base-provider-form.component.scss'
})
export class BaseProviderFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() baseProviders: BaseProvider[] = [];
  @Input() baseRates: BaseRate[] = [];
  @Input() formReadyToLoad = false;

  @Output() loadProvider = new EventEmitter<void>();
  @Output() resetProvider = new EventEmitter<void>();
  @Output() providerChanged = new EventEmitter<BaseProvider>();
  @Output() rateChanged = new EventEmitter<BaseRate>();
}
