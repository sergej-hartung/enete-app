import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {Tablecolumn } from '../../../models/tablecolumn';
import {Partner} from '../../../models/partner';
import { Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PartnerService } from '../../../services/partner.service'
import { UserLogin } from '../../../models/user-login';
import { FilterOption, GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { MainNavbarService } from '../../../services/main-navbar.service';



@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  styleUrl: './partners-list.component.scss'
})
export class PartnersListComponent implements OnInit, OnDestroy {

  @ViewChild('genericTable') genericTableComponent!: GenericTableComponent<PartnerService>;

  IsExpandable?: boolean
  parnerColumns: Tablecolumn[] = []
  filters?: FilterOption[]

  private unsubscribe$ = new Subject<void>();
  
  constructor(
    public partnerService: PartnerService,
    private mainNavbarService: MainNavbarService,
    
    ) {

    this.parnerColumns = [
      {key: 'id', title: '#', sortable: true},
      {key: 'vp_nr', title: 'GP-NR.', sortable: true},
      {key: 'last_name', title: 'Nachname', sortable: true},
      {key: 'first_name', title: 'Vorname', sortable: true},
      {key: 'accesses', title: 'Zugang', isIcon: true},
      {key: 'status_id', title: 'Status', sortable: true, isIcon: true},
    ]

    this.filters = [
      { type: 'text', key: 'search', label: 'Search' },
      {
        type: 'select',
        key: 'status_id',
        label: 'Status',
        options: [
          { label: 'Alle', value: ''},
          { label: 'Aktiv', value: '1' },
          { label: 'Inaktiv', value: '2' },
          { label: 'Gesperrt', value: '3' },
          { label: 'Gekündigt', value: '4' },
          { label: 'Interessent', value: '5' }
        ],
      },
      {
        type: 'select',
        key: 'user_profile_categorie_id',
        label: 'Kategorie',
        options: [
          { label: 'Alle', value: '' },
          { label: 'Vertrieb', value: '1'},
          { label: 'Shop', value: '2' }
        ],
      }
    ]

    this.IsExpandable = true
  }
  
  ngOnInit() {
    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(iconName => {
        if (iconName === 'new') {
          this.genericTableComponent.resetSelectedRow()
        }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

