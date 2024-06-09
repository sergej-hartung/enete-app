import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProviderService } from '../../../../../services/product/tariff/provider/provider.service';
import { NetworkOperatorService } from '../../../../../services/product/tariff/network-operator/network-operator.service';
import { StatusService } from '../../../../../services/product/tariff/status/status.service';
import { FormService } from '../../../../../services/form.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tariff-details-a-e',
  templateUrl: './tariff-details-a-e.component.html',
  styleUrl: './tariff-details-a-e.component.scss'
})
export class TariffDetailsAEComponent {
  
  combiHardware = [
    { id: 1, label: 'ohne Hardware', checked: false },
    { id: 2, label: 'mit Hardware', checked: false },
  ];
  tariffCategorys = [
    { id: 1, label: 'Privat', checked: false },
    { id: 2, label: 'Business', checked: false },
    { id: 3, label: 'Jungeleute', checked: false },
    { id: 4, label: 'VVL', checked: false },
    // { id: 4, label: 'VVL', checked: false }
  ];

  tariffFormGroup: FormGroup
  tariffStatuses: any = []
  tariffProviders: any = []
  tariffNetworkOperators: any = []

  private unsubscribe$ = new Subject<void>();

  constructor(
    private tariffStatusService: StatusService,
    private tariffProviderService: ProviderService,
    private tariffNetworkOperatorService: NetworkOperatorService,
    private formService: FormService
  ) {
    this.tariffFormGroup = this.formService.initTariffFormGroup()
  }

  ngOnInit() {
      this.tariffStatusService.data$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => { 
          if(data && data["data"]){
            this.tariffStatuses =  data.data
          }else{
            this.tariffStatuses = []
          }   
      });

      this.tariffProviderService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data && data["data"]){
          this.tariffProviders =  data.data
        }else{
          this.tariffProviders = []
        }   
      });

      this.tariffNetworkOperatorService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        if(data && data["data"]){
          this.tariffNetworkOperators =  data.data
        }else{
          this.tariffNetworkOperators = []
        }   
      });

  }

  updateSelectedItems() {
    this.combiHardware = this.combiHardware.map(option => {
      option.checked = !!option.checked;
      return option;
    });
    this.tariffCategorys = this.tariffCategorys.map(option => {
      option.checked = !!option.checked;
      return option;
    });
  } 

  get selectedCombiHardware() {
    return this.combiHardware.filter(option => option.checked);
  }

  get selectedTariffCategorys() {
    return this.tariffCategorys.filter(option => option.checked);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
