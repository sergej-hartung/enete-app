import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { EnergyService } from "../../service/energy-service.service";
import { getBonus, getGuarantee, getSavingPerYear, getTerm, getTotalPriceMonth } from "../../shared/helpers/energyRateHelpers";

type OrderEntryRate = {
  rate?: any;      // Struktur kommt aus backend/helpers – bewusst locker typisiert
  sortCount?: number;
};

@Component({
  selector: 'app-rate-overview',
  imports: [
      CommonModule,
  ],
  templateUrl: './rate-overview.component.html',
  styleUrls: ['./rate-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateOverviewComponent implements OnInit, OnChanges {
  @Input() orderEntryRate!: OrderEntryRate;

  // Vom Template erwartete Properties – Namen unverändert lassen!
  logoHtml: SafeHtml | '' = '';
  IncludingBonus: boolean = false;
  guarantee: string = '';
  term: string = '';
  bonus: number | string = 0;
  savingPerYear: string | number = 0;
  savingPerYearClass: string | boolean = false;
  totalPriceMonth: string | number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private energyService: EnergyService
  ) { console.log('test!!!')}

  ngOnInit(): void {
    this.refreshViewModel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderEntryRate'] && !changes['orderEntryRate'].firstChange) {
      this.refreshViewModel();
    }
  }

  /**
   * Baut alle abgeleiteten View-Daten auf Basis von orderEntryRate + filterData neu.
   */
  private refreshViewModel(): void {
    const rate = this.orderEntryRate?.rate;

    // Logo
    this.logoHtml = '';
    if (rate?.providerSVG) {
      this.logoHtml = this.sanitizer.bypassSecurityTrustHtml(rate.providerSVG);
    }

    // Bonus-Inklusion aus Filter
    this.IncludingBonus = !!(this.energyService?.filterData?.['filterBonus']);

    // Texte / Werte aus Helpers
    this.guarantee = rate ? getGuarantee(rate) : '';
    this.term = rate ? getTerm(rate) : '';

    const saving = rate
      ? getSavingPerYear(rate, this.IncludingBonus, this.energyService)
      : { saving: 0, savingPerYearClass: false };

    this.savingPerYear = saving.saving;
    this.savingPerYearClass = saving.savingPerYearClass;

    this.bonus = rate ? getBonus(rate) : 0;

    const totalMonth = rate ? getTotalPriceMonth(rate) : 0;
    this.totalPriceMonth = (totalMonth === false || totalMonth == null) ? 0 : totalMonth;

  }
}