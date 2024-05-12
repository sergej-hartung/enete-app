import { Component } from '@angular/core';

@Component({
  selector: 'app-tariff-add-edit',
  templateUrl: './tariff-add-edit.component.html',
  styleUrl: './tariff-add-edit.component.scss'
})
export class TariffAddEditComponent {

  active = 1

  combiHardware = [
    { id: 1, label: 'ohne Hardware', checked: false },
    { id: 2, label: 'mit Hardware', checked: false }
  ];
  tariffCategorys = [
    { id: 1, label: 'Privat', checked: false },
    { id: 2, label: 'Business', checked: false },
    { id: 3, label: 'Jungeleute', checked: false },
    { id: 4, label: 'VVL', checked: false }
  ];

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

}
