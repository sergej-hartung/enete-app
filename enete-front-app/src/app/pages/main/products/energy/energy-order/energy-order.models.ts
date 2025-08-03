export interface EnergyRate {
  rateId: number | string;
  rateName?: string;
  providerName?: string;
  providerSVG?: string;
  requiredEmail?: boolean;
  selfPayment?: boolean;
  optEco?: boolean;
  optBonus?: number;
  optBonusInstant?: number;
  optBonusLoyalty?: number;
  providerChangeFast?: boolean;
  totalPrice?: number;
  workPrice?: number;
  basePriceYear?: number;
  basePriceMonth?: number;
  partialPayment?: number;
  termBeforeChangeMaxDate?: string; // dd.MM.yyyy
  termAfterNewMaxDate?: string;     // dd.MM.yyyy
  termBeforeNewMaxDate?: string;    // dd.MM.yyyy
  optinAdvertiseEmail?: boolean;
  optinAdvertiseMobile?: boolean;
  optinAdvertisePersonally?: boolean;
  optinAdvertisePhone?: boolean;
  optinAdvertisePost?: boolean;
}

export interface OrderEntryRate {
  rate?: EnergyRate;
  sortCount?: number;
}

export interface StepState {
  id: number;          // 1..5
  name: 'step1'|'step2'|'step3'|'step4'|'step5';
  success: boolean;
  error: boolean;
}

export interface LegalFormItem {
  legalForm: string;
  legalFormText: string;
}

export interface ProviderItem {
  name: string;
  vdew?: string|number;
}

export interface RatesData {
  type?: 'private'|'company';
  zip?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  consum?: number;
  consumNt?: number;
  branch?: string;
}