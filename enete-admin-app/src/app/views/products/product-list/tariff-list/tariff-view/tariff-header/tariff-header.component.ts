import { Component, Input } from '@angular/core';
import { SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { Tariff } from '../../../../../../models/tariff/tariff';

@Component({
  selector: 'app-tariff-header',
  templateUrl: './tariff-header.component.html',
  styleUrl: './tariff-header.component.scss'
})
export class TariffHeaderComponent {
  @Input() tariff: Tariff | null = null;
  @Input() tariffTpls: any[] = [];
  @Input() logoNetworkOperatorContent: SafeResourceUrl | null = null;
  @Input() logoProviderContent: SafeResourceUrl | null = null;
  @Input() getSafeHtml!: (html: string | null) => SafeHtml;


  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  get firstTpl() {
    return this.tariffTpls?.[0] || null;
  }

  get midleTpls(){
    return this.tariffTpls?.slice(1,4) || [];
  }

  get otherTpls() {
    // Вероятно, вам нужно подстроить логику выбора атрибутов
    return this.tariffTpls?.slice(1,4) || [];
  }

  // Утилитный метод для получения имени атрибута
  getFieldName(tpl: any): string {
    if (tpl?.auto_field_name && tpl?.attribute && !tpl.is_matrix) {
      return tpl.attribute.name;
    } else if(tpl?.auto_field_name && tpl?.is_matrix && tpl.matrix){
      return tpl.matrix.name
    } else if (!tpl?.auto_field_name) {
      return tpl.manual_field_name;
    }
    return '';
  }
 

  // Утилитный метод для получения значения атрибута (строка или HTML)
  getValue(tpl: any): {value: string | null, isHtml: boolean} {
    if (tpl?.auto_value_source && tpl?.attribute && !tpl?.is_matrix) {
      if (tpl.attribute.value_varchar) {
        return { value: tpl.attribute.value_varchar, isHtml: false };
      } else if (tpl.attribute.value_text) {
        return { value: tpl.attribute.value_text, isHtml: true };
      }
    }else if(tpl?.auto_value_source && tpl?.is_matrix && tpl?.matrix){
      return { value: tpl?.matrix?.total_value, isHtml: false };
    } else if (!tpl?.auto_value_source) {
      if (tpl.is_html && tpl.manual_value_html) {
        return { value: tpl.manual_value_html, isHtml: true };
      } else if (!tpl.is_html && tpl.manual_value) {
        return { value: tpl.manual_value, isHtml: false };
      }
    }
    return { value: null, isHtml: false };
  }

  // Утилитный метод для получения единиц измерения
  getUnit(tpl: any): string {
    if (tpl?.show_unit) {
      if (tpl.auto_unit && tpl.attribute && !tpl.is_matrix) {
        return tpl.attribute.unit;
      } else if(tpl.auto_unit && tpl.is_matrix && tpl?.matrix){
        return tpl.matrix?.unit
      } else if (!tpl.auto_unit) {
        return tpl.manual_unit;
      }
    }
    return '';
  }

  isPrice(tpl: any): boolean{
    let value = this.getValue(tpl)
    let unit = this.getUnit(tpl)
    let priceUnit = ['EUR', 'eur', 'Eur', 'EURO', 'Euro', 'euro', '€']
    
    if(value.value && !value.isHtml && priceUnit.find(u => u == unit )){
      return true
    }

    return false
  }
}
