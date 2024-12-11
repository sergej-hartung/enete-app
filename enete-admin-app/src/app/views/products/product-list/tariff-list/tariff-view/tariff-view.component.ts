import { Component } from '@angular/core';

interface CollapseState {
  isCollapseTariffDetails: boolean;
  isCollapseTariffPromo: boolean;
  isCollapseTariffCommission: boolean;
}

@Component({
  selector: 'app-tariff-view',
  templateUrl: './tariff-view.component.html',
  styleUrl: './tariff-view.component.scss'
})
export class TariffViewComponent {
  active = 1;

  collapseStates: CollapseState = {
    isCollapseTariffDetails: false,
    isCollapseTariffPromo: false,
    isCollapseTariffCommission: false
  }







  toggleCollapse(collapseAtr: string){
    if(collapseAtr === 'TariffDetails'){
      this.collapseStates.isCollapseTariffDetails = !this.collapseStates.isCollapseTariffDetails
      this.collapseStates.isCollapseTariffPromo = false
      this.collapseStates.isCollapseTariffCommission = false
    }
    if(collapseAtr === 'TariffPromo'){
      this.collapseStates.isCollapseTariffDetails = false
      this.collapseStates.isCollapseTariffPromo = !this.collapseStates.isCollapseTariffPromo
      this.collapseStates.isCollapseTariffCommission = false
    }
    if(collapseAtr === 'TariffCommission'){
      this.collapseStates.isCollapseTariffDetails = false
      this.collapseStates.isCollapseTariffPromo = false
      this.collapseStates.isCollapseTariffCommission = !this.collapseStates.isCollapseTariffCommission
    }
  }

  // resetCollapseStates(){
  //   this.
  // }
}
