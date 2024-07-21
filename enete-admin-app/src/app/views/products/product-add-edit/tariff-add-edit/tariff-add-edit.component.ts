import { Component } from '@angular/core';
import { FormService } from '../../../../services/form.service';

@Component({
  selector: 'app-tariff-add-edit',
  templateUrl: './tariff-add-edit.component.html',
  styleUrl: './tariff-add-edit.component.scss'
})
export class TariffAddEditComponent {

  active = 1

  constructor(
    private formService: FormService
  ) {}

  
  ngOnDestroy() {
    //this.formService.tariffForm.reset()
  }
}
