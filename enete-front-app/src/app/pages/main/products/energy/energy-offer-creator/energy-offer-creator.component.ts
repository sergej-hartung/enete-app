import { Component, Input } from '@angular/core';
import { Offer } from '../service/energy-service.service';

@Component({
  selector: 'app-energy-offer-creator',
  imports: [],
  templateUrl: './energy-offer-creator.component.html',
  styleUrl: './energy-offer-creator.component.scss'
})
export class EnergyOfferCreatorComponent {
  @Input() offers: Offer[] = []
}
