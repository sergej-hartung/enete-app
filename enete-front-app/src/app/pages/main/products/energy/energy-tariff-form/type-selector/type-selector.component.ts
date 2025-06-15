import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EnergyService } from '../../service/energy-service.service';
import { EnergyTariffFormFactoryService } from '../../service/energy-tariff-form-factory.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-type-selector',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './type-selector.component.html',
  styleUrl: './type-selector.component.scss'
})
export class TypeSelectorComponent {
  @Input() typeForm!: FormGroup;
  @Input() typeMap: { [key in 'private' | 'company' | 'weg']: string } = {
    private: 'Privat',
    company: 'Gewerbe',
    weg: 'WEG'
  };

  selectTypeName: string = this.typeMap['private'];
  private destroyRef = inject(DestroyRef);
  private energyService = inject(EnergyService);

  ngOnInit(): void {
    this.typeForm.get('type')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((val: 'private' | 'company' | 'weg') => {
      if (val && this.isValidType(val)) {
        this.selectTypeName = this.typeMap[val];
        this.energyService.resetDataRatesForm$.next();
      }
    });
  }

  private isValidType(type: string): type is keyof typeof this.typeMap {
    return type in this.typeMap;
  }
}
