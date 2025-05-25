import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../main-layout/breadcrumbs/breadcrumbs.component';
import { EnergyTariffFormComponent } from './energy-tariff-form/energy-tariff-form.component';

@Component({
  selector: 'app-energy',
  imports: [BreadcrumbsComponent, EnergyTariffFormComponent],
  templateUrl: './energy.component.html',
  styleUrl: './energy.component.scss',
  host: {
    'class': 'content_rechner'
  }
})
export class EnergyComponent {

}
