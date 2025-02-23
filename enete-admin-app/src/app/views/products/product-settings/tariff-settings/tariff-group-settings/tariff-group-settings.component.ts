import { Component } from '@angular/core';
import { Tablecolumn } from '../../../../../models/tablecolumn';
import { FilterOption } from '../../../../../shared/components/generic-table/generic-table.component';
import { TariffGroupService } from '../../../../../services/product/tariff/tariff-group.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-tariff-group-settings',
  templateUrl: './tariff-group-settings.component.html',
  styleUrl: './tariff-group-settings.component.scss',
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(100%)'})),
      state('*', style({ transform: 'translateX(0)'})),
      transition('void => *', [
        animate('300ms ease-out'),
      ]),
      transition('* => void', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)'}))
      ])
    ]),
    // Animation für die linke Seite (Breitenwechsel)
    trigger('resizeLeft', [
      state('full', style({ width: '100%' })),
      state('partial', style({ width: '58.33%' })), // ca. 7 von 12 Spalten
      transition('full <=> partial', [
        animate('300ms ease-in-out')
      ])
    ]),
  ]
})
export class TariffGroupSettingsComponent {

  IsExpandable = false;

  groupEditOrNew = false

  groupColumns: Tablecolumn[] = [
    { key: 'id', title: '#', sortable: true },
    { key: 'name', title: 'Name', sortable: true }, 
    { key: 'icon', title: 'Icon', sortable: true, isIcon: true },
    { key: 'color', title: 'Farbe', sortable: true },
    { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
    { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true},
  ];

  filters: FilterOption[] = [
      { type: 'text', key: 'search', label: 'Search' }
    ];


    
  
  constructor(
    public tariffGroupService: TariffGroupService
      // public tariffService: TariffService,
      // private tariffStatusService: StatusService,
      // private tariffProviderService: ProviderService,
      // private tariffNetworkOperatorService: NetworkOperatorService,
      // private productService: ProductService,
      // private mainNavbarService: MainNavbarService,
      // private tariffSortingService: SortingService,
      //private attributeGroupService: AttributeGroupService
    ) {}
  
    ngOnInit() {
      this.tariffGroupService.fetchData()

    }

    openNewGroup() {
      this.groupEditOrNew = true;
    }
  
    editGroup() {
      this.groupEditOrNew = !this.groupEditOrNew
    }
  
    closeGroup() {
      this.groupEditOrNew = false;
    }


    sort(event: any){

      console.log(event)
    }

    filter(event: any){
      
      console.log(event)
    }
  
    selectedRow(event: any){
  
      console.log(event)
    }
}
