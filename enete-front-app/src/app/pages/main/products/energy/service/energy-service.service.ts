import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// --- Interfaces zur Typisierung ---
export interface Rate {
  rateId: string;
  termBeforeChangeMaxDate?: string;
  termAfterNewMaxDate?: string;
  termBeforeNewMaxDate?: string;
  providerChangeFast?: boolean;
  requiredEmail?: boolean;
}

export interface OrderEntry {
  rate?: Rate;
  sortCount?: number;
}

export interface Offer extends Rate {}

export interface ChangeDateRange {
  minChangeDate: Date;
  maxChangeDate: Date;
  minMoveInDate: Date;
  maxMoveInDate: Date;
  minTerminatedDate: Date;
  maxTerminatedDate: Date;
  minSignatureDate: Date;
  maxSignatureDate: Date;
  minChangeDays: number;
  minTerminatedDays: number;
  maxSignatureDays: number;
  minSignatureDays: number;
  isChangeFastOption: boolean;
  invoiceByPost: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnergyService {
  // --- Subjects (statt EventEmitter) ---
  public filterModifi$ = new Subject<any>();
  private _ratesData: any; // private property
  public getRates$ = new Subject<any>(); // event emitter für neue Daten

  public resetDataRatesForm$ = new Subject<void>();
  public deleteOffer$ = new Subject<Offer>();
  public toggleOrderEntry$ = new Subject<OrderEntry>();
  public orderFinished$ = new Subject<void>();

  // --- Datenhaltung ---
  public filterData: Record<string, any> = {};

  public orderEntryTarif: OrderEntry = {};
  public orderFinishData: any[] = [];
  public orderParck = false;
  public offers: Offer[] = [];

  // --- Zustände für Wechseltermin etc. ---
  public isChangeFastOption = false;
  public invoiceByPost = false;

  public minChangeDays = 21;
  public minTerminatedDays = 14;
  public maxSignatureDays = 0;
  public minSignatureDays = 14;

  public minChangeDate!: Date;
  public maxChangeDate!: Date;
  public minMoveInDate!: Date;
  public maxMoveInDate!: Date;
  public minTerminatedDate!: Date;
  public maxTerminatedDate!: Date;
  public maxSignatureDate!: Date;
  public minSignatureDate!: Date;

  // --- Angebote ---
  setOffers(offer: Offer): Offer[] | false {
    if (this.offers.length < 3) {
      this.offers.push(offer);
      return this.offers;
    }
    return false;
  }

  getOffers(): Offer[] {
    return this.offers;
  }

  deleteOffer(offer: Offer): void {
    this.deleteOffer$.next({ ...offer });
    const index = this.offers.findIndex(o => o.rateId === offer.rateId);
    if (index > -1) this.offers.splice(index, 1);
  }

  resetOffers(): void {
    this.offers = [];
  }

  // --- Tarifauswahl ---
  setOrderEntryTarif(tarif: OrderEntry): void {
    this.orderEntryTarif = tarif;
    this.toggleOrderEntry$.next(this.orderEntryTarif);
  }

  deleteOrderEntryTarif(): void {
    this.orderEntryTarif = {};
    this.orderFinishData = [];
    this.orderParck = false;
    this.isChangeFastOption = false;
    this.invoiceByPost = false;
    this.toggleOrderEntry$.next(this.orderEntryTarif);
  }

  // --- Gesamtdaten zurücksetzen ---
  resetData(): void {
    this.resetOffers();
    this.filterData = {};
    this.ratesData = null;
    this.orderEntryTarif = {};
    this.orderFinishData = [];
    this.orderParck = false;
    this.isChangeFastOption = false;
    this.invoiceByPost = false;
  }

  // --- Wechsel-/Liefertermine ermitteln ---
  getDatesForPreSuppler(): ChangeDateRange {
    this.setMinChangeDate(this.minChangeDays);
    this.setMaxChangeDate(this.orderEntryTarif);
    this.setMinMoveInDate(this.orderEntryTarif);
    this.setMaxMoveInDate(this.orderEntryTarif);
    this.setMinTerminatedDate(this.minTerminatedDays);
    this.setMaxTerminatedDate(this.orderEntryTarif);
    this.setMaxSignatureDate(this.maxSignatureDays);
    this.setMinSignatureDate(this.minSignatureDays);
    this.checkChangeFastOption(this.orderEntryTarif);
    this.checkInvoiceByPost(this.orderEntryTarif);

    return {
      minChangeDate: this.minChangeDate,
      maxChangeDate: this.maxChangeDate,
      minMoveInDate: this.minMoveInDate,
      maxMoveInDate: this.maxMoveInDate,
      minTerminatedDate: this.minTerminatedDate,
      maxTerminatedDate: this.maxTerminatedDate,
      minSignatureDate: this.minSignatureDate,
      maxSignatureDate: this.maxSignatureDate,
      minChangeDays: this.minChangeDays,
      minTerminatedDays: this.minTerminatedDays,
      maxSignatureDays: this.maxSignatureDays,
      minSignatureDays: this.minSignatureDays,
      isChangeFastOption: this.isChangeFastOption,
      invoiceByPost: this.invoiceByPost
    };
  }

  // --- Hilfsfunktionen zum Setzen von Daten ---
  private parseGermanDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('.');
    return new Date(`${year}-${month}-${day}`);
  }

  private setMinChangeDate(days: number): void {
    this.minChangeDate = new Date();
    this.minChangeDate.setDate(this.minChangeDate.getDate() + days);
  }

  private setMaxChangeDate(order: OrderEntry): void {
    const dateStr = order.rate?.termBeforeChangeMaxDate;
    if (dateStr) this.maxChangeDate = this.parseGermanDate(dateStr);
  }

  private setMinMoveInDate(order: OrderEntry): void {
    const dateStr = order.rate?.termAfterNewMaxDate;
    if (dateStr) this.minMoveInDate = this.parseGermanDate(dateStr);
  }

  private setMaxMoveInDate(order: OrderEntry): void {
    const dateStr = order.rate?.termBeforeNewMaxDate;
    if (dateStr) this.maxMoveInDate = this.parseGermanDate(dateStr);
  }

  private setMinTerminatedDate(days: number): void {
    this.minTerminatedDate = new Date();
    this.minTerminatedDate.setDate(this.minTerminatedDate.getDate() + days);
  }

  private setMaxTerminatedDate(order: OrderEntry): void {
    const dateStr = order.rate?.termBeforeChangeMaxDate;
    if (dateStr) {
      const date = this.parseGermanDate(dateStr);
      date.setDate(date.getDate() - 1);
      this.maxTerminatedDate = date;
    }
  }

  private setMaxSignatureDate(days: number): void {
    this.maxSignatureDate = new Date();
    this.maxSignatureDate.setDate(this.maxSignatureDate.getDate() + days);
  }

  private setMinSignatureDate(days: number): void {
    this.minSignatureDate = new Date();
    this.minSignatureDate.setDate(this.minSignatureDate.getDate() - (days - 1));
  }

  private checkChangeFastOption(order: OrderEntry): void {
    this.isChangeFastOption = !!order.rate?.providerChangeFast;
  }

  private checkInvoiceByPost(order: OrderEntry): void {
    this.invoiceByPost = !order.rate?.requiredEmail;
  }

  set ratesData(data: any) {
    this._ratesData = data;
    this.getRates$.next(data); // automatisch Event auslösen
  }

  get ratesData(): any {
    return this._ratesData;
  }
}