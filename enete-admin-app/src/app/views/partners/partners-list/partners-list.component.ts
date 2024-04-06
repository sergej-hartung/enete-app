import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {Tablecolumn } from '../../../models/tablecolumn';
import { Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PartnerService } from '../../../services/partner/partner.service'
import { FilterOption, GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { MainNavbarService } from '../../../services/main-navbar.service';
import { StatusService } from '../../../services/partner/status/status.service';
import { CategorieService } from '../../../services/partner/categorie/categorie.service';
import { Status } from '../../../models/partner/status/status';
import { Categorie } from '../../../models/partner/categorie/categorie';



@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  styleUrl: './partners-list.component.scss'
})
export class PartnersListComponent implements OnInit, OnDestroy {

  @ViewChild('genericTable') genericTable!: GenericTableComponent<PartnerService>;

  IsExpandable = true;
  parnerColumns: Tablecolumn[] = [
    { key: 'id', title: '#', sortable: true },
    { key: 'vp_nr', title: 'GP-NR.', sortable: true }, 
    { key: 'first_name', title: 'Vorname', sortable: true },
    { key: 'last_name', title: 'Nachname', sortable: true },
    { key: 'accesses', title: 'Zugang', isIcon: true },
    { key: 'status', title: 'Status', sortable: true, isIcon: true },
  ];

  filters: FilterOption[] = [
    { type: 'text', key: 'search', label: 'Search' },
    { type: 'select', key: 'status_id', label: 'Status', options: [] },
    { type: 'select', key: 'categorie_id', label: 'Kategorie', options: [] },
  ];

  private unsubscribe$ = new Subject<void>();
  
  constructor(
    public partnerService: PartnerService,
    private statusService: StatusService,
    private categorieService: CategorieService,
    private mainNavbarService: MainNavbarService
  ) {}
  
  ngOnInit() {
    this.listenForIconClicks();
    this.subscribeToData();
  }

  private listenForIconClicks(): void {
    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(iconName => iconName === 'new' && this.genericTable.resetSelectedRow());
  }

  private subscribeToData(): void {
    this.setupServiceSubscription(this.statusService, 'statuses', 'status_id', 'Status');
    this.setupServiceSubscription(this.categorieService, 'categories', 'categorie_id', 'Kategorie');
  }

  private setupServiceSubscription(service: StatusService | CategorieService, entityType: string, key: string, label: string): void {
    service.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if (data && data.requestType === "get" && data.entityType === entityType) {
          this.updateFilterOptions(key, label, data.data);
          this.updateSelectedFilters();
        }
      });
  }

  private updateFilterOptions(key: string, label: string, data: Status[] | Categorie[]): void {
    const options = [{ label: 'Alle', value: '' }, ...data.map(d => ({ label: d.name, value: d.id.toString() }))];
    const filter = this.filters.find(f => f.key === key && f.label === label);
    if (filter) filter.options = options;
  }

  private updateSelectedFilters(): void {
    if (this.partnerService.filters && !this.isObjectEmpty(this.partnerService.filters)) {
      const { filters } = this.partnerService;
      Object.keys(filters).forEach(filterKey => {
        const filter = this.filters.find(f => f.key === filterKey && f.type === 'select');
        if (filter && filter.options) {
          const selectedOption = filter.options.find(option => option.value === filters[filterKey]);
          if (selectedOption) selectedOption.selected = true;
        }
      });
    }
  }

  isObjectEmpty(obj: Object): boolean {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

