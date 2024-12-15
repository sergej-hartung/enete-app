import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  isPrice(unit: string | null | undefined){
    let priceUnit = ['EUR', 'eur', 'Eur', 'EURO', 'Euro', 'euro', '€']
    
    if(unit && priceUnit.find(u => u == unit )){
      return true
    }

    return false
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
}
