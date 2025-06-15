import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EnergyService } from '../../service/energy-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EnergyTariffFormFactoryService } from '../../service/energy-tariff-form-factory.service';

@Component({
  selector: 'app-branch-selector',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './branch-selector.component.html',
  styleUrl: './branch-selector.component.scss'
})
export class BranchSelectorComponent implements OnInit{
  @Input() branchForm!: FormGroup;
  @Input() branchMap: { [key in 'electric' | 'gas' | 'warmth']: string } = {
    electric: 'Strom',
    gas: 'Gas',
    warmth: 'Wärme'
  };

  selectBranchName: string = this.branchMap['electric'];
  private destroyRef = inject(DestroyRef);
  private energyService = inject(EnergyService);

  ngOnInit(): void {
    this.branchForm.get('branch')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((val: 'electric' | 'gas' | 'warmth') => {
      if (val && this.isValidBranch(val)) {
        this.selectBranchName = this.branchMap[val];
        this.energyService.resetDataRatesForm$.next();
      }
    });
  }

  private isValidBranch(branch: string): branch is keyof typeof this.branchMap {
    return branch in this.branchMap;
  }
}
