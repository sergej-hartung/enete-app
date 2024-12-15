import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-tariff-attribute-view',
  templateUrl: './tariff-attribute-view.component.html',
  styleUrl: './tariff-attribute-view.component.scss'
})
export class TariffAttributeViewComponent {
  @Input() icon?: string;
  @Input() showIcon = false;
  @Input() showFieldName = false;
  @Input() showValue = false;
  @Input() showUnit = false;
  @Input() fieldName!: string;
  @Input() value!: string | null;
  @Input() unit!: string | null;
  @Input() isHtml = false;
  @Input() isPrice = false;
  @Input() getSafeHtml!: (html: string|null) => SafeHtml;



  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
}
