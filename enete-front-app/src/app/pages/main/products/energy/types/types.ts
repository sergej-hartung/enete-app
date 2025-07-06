export interface City {
    city: string;
    zip?: string;
  }
  
  export interface NetzProvider {
    netzName: string;
  }
  
  export interface BaseRate {
    rateName: string;
    basePriceYear: number;
    workPrice: number;
    workPriceNt: number;
  }
  
  export interface BaseProvider {
    providerName: string;
    rates: BaseRate[];
  }
  

  export interface PeopleMap {
    [key: string]: { [key: string]: string };
    electric: { one: string; two: string; three: string; four: string };
    gas: { one: string; two: string; three: string; four: string };
  }
  
  export interface RatesData {
    branch: 'electric' | 'gas' | 'warmth';
    type: 'private' | 'company' | 'weg';
    zip: string;
    city: string;
    street: string;
    houseNumber: string;
    netzProv: NetzProvider | null;
    consum: string;
    consumNt?: string;
    rateType?: string;
    rateReadingType?: string;
    providerName: string;
    rateName: string;
    basePriceYear: string;
    workPrice: string;
    workPriceNt: string;
  }