import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { TariffDetail } from '../../../../../../models/tariff/tariff';
import { UtilsService } from '../shared/utils.service';


@Component({
  selector: 'app-tariff-details-view',
  templateUrl: './tariff-details-view.component.html',
  styleUrl: './tariff-details-view.component.scss'
})
export class TariffDetailsViewComponent {
  @Input() tariffDetails: TariffDetail[] = [];
  @Input() getSafeHtml!: (html: string | null) => SafeHtml;

  constructor(
      public utilsService: UtilsService
  ) {}
  
}
