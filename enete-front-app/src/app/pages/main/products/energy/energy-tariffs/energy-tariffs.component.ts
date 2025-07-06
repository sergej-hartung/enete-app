import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EnergyService } from '../service/energy-service.service';
import { HttpEnergyService } from '../service/http-energy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getGuarantee, getTerm } from '../shared/helpers/energyRateHelpers';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-energy-tariffs',
  imports: [CommonModule, NgbCollapseModule],
  templateUrl: './energy-tariffs.component.html',
  styleUrl: './energy-tariffs.component.scss'
})
export class EnergyTariffsComponent {
  // Inputs
  @Input() rate:any = {}
  @Input() IncludingBonus: boolean =  false
  @Input() count:any
  @Input() ratesData:any

  // Reactive signals (alternative to class props)
  // inTheOffer = false
  // logoHtml: SafeHtml = ''
  // totalPrice = ''
  // bonus = ''
  // savingPerYear = ''
  // savingPerYearClass = false
  // totalPriceMonth = ''
  // guarantee = ''
  // term = ''
  // cancel = ''

  // urlDataProtection = ''
  // urlPowerOfAttorney = ''

  logoHtml = signal<SafeHtml>('');
  inTheOffer = signal(false);
  guarantee = signal('');
  term = signal('');
  cancel = signal('');
  totalPriceMonth = signal('');
  savingPerYear = signal('');
  savingPerYearClass = signal(false);
  bonus = signal(0);
  urlDataProtection = signal('');
  urlPowerOfAttorney = signal('');

  // Collapse state
  isCollapsedTarifDetails = true;
  isCollapsedCharacteristics = true;
  isCollapsedTarifProvision = true;

  // Services
  private destroyRef = inject(DestroyRef);
  private sanitizer = inject(DomSanitizer);
  private energyService = inject(EnergyService);
  private httpEnergyService = inject(HttpEnergyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.refreshView();

    // this.energyService.deleteOfferEvent
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((event) => {
    //     if (event?.rateId === this.rate?.rateId) {
    //       this.inTheOffer.set(false);
    //     }
    //   });
    this.energyService.offers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(offers => {
        const rateId = this.rate?.rateId
        const found = offers?.some(o => o?.rateId === rateId);
        this.inTheOffer.set(found);
      })

  }

  ngOnChanges() {
    this.refreshView();
  }

  private refreshView() {
    this.setLogo();
    this.setDocumentsUrl();
    this.bonus.set(this.calculateBonus());
    this.savingPerYear.set(this.calculateSavingPerYear());
    this.totalPriceMonth.set(this.calculateTotalPriceMonth());
    this.guarantee.set(getGuarantee(this.rate));
    this.term.set(getTerm(this.rate));
    this.cancel.set(this.getCancelText());
  }

  private setLogo() {
    const html = this.rate?.providerSVG ?? '';
    this.logoHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
  }

  private setDocumentsUrl() {
    const docs = this.rate?.additionalInformation ?? [];
    const dp = docs.find((d: any) => d.informationId === 3147)?.text ?? '';
    const poa = docs.find((d: any) => d.informationId === 3148)?.text ?? '';

    this.urlDataProtection.set(this.extractUrl(dp));
    this.urlPowerOfAttorney.set(this.extractUrl(poa));
  }

  private extractUrl(text: string): string {
    const matches = text.match(
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
    );
    return matches?.[0] ?? '';
  }

  downloadFile(url: string, name: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  downloadDataProtection() {
    this.downloadFile(this.urlDataProtection(), 'Datenschutzerklärung.pdf');
  }

  downloadPowerOfAttorney() {
    this.downloadFile(this.urlPowerOfAttorney(), 'Vollmacht.pdf');
  }

  setOffers() {
    this.energyService.setOffers(this.rate)
    // if (this.energyService.setOffers(this.rate)) {
    //   this.inTheOffer.set(true);
    // }
  }

  orderEntry() {
    this.energyService.setOrderEntryTarif({
      sortCount: this.count + 1,
      rate: this.rate
    });
  }

  private calculateBonus(): number {
    return (this.rate?.optBonus ?? 0) + (this.rate?.optBonusInstant ?? 0);
  }

  private calculateSavingPerYear(): string {
    const saving = this.rate?.savingPerYear ?? 0;
    const total = this.rate?.totalPrice ?? 0;
 
    if (!this.ratesData?.workPrice) {
      this.savingPerYearClass.set(false);
      return '-/-';
    }

    let adjustedSaving = saving;

    if (this.IncludingBonus) {
      adjustedSaving += this.calculateBonus();
    }

    if (adjustedSaving > 0) {
      this.savingPerYearClass.set(true);
      return adjustedSaving.toFixed(2) + ' €';
    }

    this.savingPerYearClass.set(false);
    return 'keine Ersparnis';
  }

  private calculateTotalPriceMonth(): string {
    const total = this.rate?.totalPriceWithoutBonus;
    const payments = this.rate?.partialPayment;
    if (total && payments) {
      return (total / payments).toFixed(2);
    }
    return '0.00';
  }

  private getCancelText(): string {
    const type = this.rate?.cancelType;
    const value = this.rate?.cancel;

    if (!type || !value) return 'Keine Angabe';

    const plural = value > 1 ? 'e' : '';
    switch (type) {
      case 1:
        return `${value} Tag${plural}`;
      case 2:
        return `${value} Woche${plural}`;
      case 3:
        return `${value} Monat${plural}`;
      default:
        return 'Keine Angabe';
    }
  }

  toggle(section: 'isCollapsedTarifDetails' | 'isCollapsedCharacteristics' | 'isCollapsedTarifProvision') {
    const wasOpen = !this[section];

    this.isCollapsedTarifDetails = true;
    this.isCollapsedCharacteristics = true;
    this.isCollapsedTarifProvision = true;
    
    if (!wasOpen) {
      this[section] = false;
    }
    
  }

  downloadContractFileBlank() {
    const { rateId, rateFileId, providerName, rateName } = this.rate ?? {};
    console.log(rateId)
    console.log(rateFileId)
    if (rateId && rateFileId) {
      this.httpEnergyService.getContractFileBlanko(rateId, rateFileId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((blob: any) => {
          const filename = `${providerName?.replace(/\s+/g, '-').toLowerCase()}-${rateName?.replace(/\s+/g, '-').toLowerCase()}.pdf`;
          const fileBlob = this.convertBase64ToBlobData(blob.file, blob.mimeType.mime, blob.bytes);
          saveAs(fileBlob, filename);
        });
    }
  }

  private convertBase64ToBlobData(base64Data: string, contentType: string = 'application/pdf', sliceSize = 512): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = Array.from(slice).map(char => char.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  }

  ngOnDestroy() {
    // `takeUntilDestroyed` handles cleanup
  }
}
