import { Component } from '@angular/core';
import { TariffGroupService } from '../../../../services/product/tariff/tariff-group.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tariff-settings',
  templateUrl: './tariff-settings.component.html',
  styleUrl: './tariff-settings.component.scss'
})
export class TariffSettingsComponent {
  active = 1;

  private unsubscribe$ = new Subject<void>();

  constructor(
      public tariffGroupService: TariffGroupService,
      
    ) {}

  ngOnDestroy() {
    this.tariffGroupService.resetData()
    this.tariffGroupService.resetDetailedData()
    
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

