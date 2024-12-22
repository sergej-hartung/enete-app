import { Component, Input } from '@angular/core';
import { Promo } from '../../../../../../models/tariff/tariff';
import { SafeHtml } from '@angular/platform-browser';
import { UtilsService } from '../shared/utils.service';

@Component({
  selector: 'app-tariff-promo-view',
  templateUrl: './tariff-promo-view.component.html',
  styleUrl: './tariff-promo-view.component.scss'
})
export class TariffPromoViewComponent {
  @Input() promos: Promo[] = [];
  @Input() getSafeHtml!: (html: string | null) => SafeHtml;

  constructor(
      public utilsService: UtilsService
  ) {}


  isPromoExpired(endDate: string): boolean {
    const currentDate = new Date();
    const promoEndDate = new Date(endDate);

    return promoEndDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0);
  }
}
