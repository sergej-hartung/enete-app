import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tablecolumn } from '../../../../../models/tablecolumn';
import { FilterOption } from '../../../../../shared/components/generic-table/generic-table.component';
import { MainNavbarService } from '../../../../../services/main-navbar.service';
import { NotificationService } from '../../../../../services/notification.service';
import { FormService } from '../../../../../services/form.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreloaderService } from '../../../../../services/preloader.service';
import { MatDialog } from '@angular/material/dialog';
import { AttributeService } from '../../../../../services/product/tariff/attribute/attribute.service';

@Component({
  selector: 'app-tariff-attribute-settings',
  templateUrl: './tariff-attribute-settings.component.html',
  styleUrl: './tariff-attribute-settings.component.scss',
  animations: [
      trigger('slideIn', [
        state('void', style({ transform: 'translateX(100%)'})),
        state('*', style({ transform: 'translateX(0)'})),
        transition('void => *', [animate('300ms ease-out')]),
        transition('* => void', [animate('300ms ease-in', style({ transform: 'translateX(100%)'}))])
      ]),
      // Animation für die linke Seite (Breitenwechsel)
      trigger('resizeLeft', [
        state('full', style({ width: '100%' })),
        state('partial', style({ width: '58.33%' })), // ca. 7 von 12 Spalten
        transition('full <=> partial', [animate('300ms ease-in-out')])
      ]),
    ]
})
export class TariffAttributeSettingsComponent {

  IsExpandable = false;
  attributeEditOrNew = false;
  //tariffAttributeForm: FormGroup;
  selectedAttribute: any = ''
  mode: any = ''
  private unsubscribe$ = new Subject<void>();

  attributeColumns: Tablecolumn[] = [
    { key: 'id', title: '#', sortable: true },
    { key: 'code', title: 'Kennung', sortable: true }, 
    { key: 'name', title: 'Name', sortable: true },
    { key: 'input_type', title: 'Typ', sortable: true },
    { key: 'unit', title: 'Einheit', sortable: true },
    { key: 'is_system_text', title: 'Systemfeld'},
    { key: 'is_required_text', title: 'Pflichtfeld'},
    { key: 'is_frontend_visible_text', title: 'Sichtbar im Frontend'},
    { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
    { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true},
  ];

  filters: FilterOption[] = [
    { type: 'text', key: 'search', label: 'Search' },
    { type: 'select', key: 'tariff_group_id', label: 'Tarifgruppe', options: [] },
  ];

  constructor(
      public tariffAttributeService: AttributeService,
      private mainNavbarService: MainNavbarService,
      private notificationService: NotificationService,
      private formService: FormService,
      private snackBar: MatSnackBar,
      private preloaderService: PreloaderService,
      private dialog: MatDialog
    ) {
      //this.tariffGroupForm = this.formService.createTariffGroupFormGroup()

      this.mainNavbarService.setIconState('save', true, true);
      this.mainNavbarService.setIconState('new', true, true);
      this.mainNavbarService.setIconState('back', false, true);
      this.mainNavbarService.setIconState('edit', true, true);
      this.mainNavbarService.setIconState('delete', true, true);
    }

    ngOnInit() {
      this.tariffAttributeService.fetchData()
      this.mainNavbarService.setIconState('new', true, false);


      this.mainNavbarService.confirmAction$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(action => action.proceedCallback())
  
      this.mainNavbarService.iconClicks$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(button => this.handleIconClick(button));
    }

    private handleIconClick(button: string): void {
      console.log(button)
      if (button === 'new') {
        this.mode = 'new';
        this.newGroup();
      } else if (button === 'edit') {
        // this.mode = 'edit';
        // this.editGroup();
      } else if (button === 'save') {
        //this.saveGroup();
      } else if (button === 'delete'){
        //console.log('delete')
        //this.showNotification(() => this.deleteGroup(this.selectedGroup?.id))
      }
    }

    private newGroup(){
      this.attributeEditOrNew = true
      this.attributeColumns = [
        { key: 'id', title: '#', sortable: true },
        { key: 'code', title: 'Code', sortable: true }, 
        { key: 'name', title: 'Name', sortable: true },
        { key: 'input_type', title: 'Typ', sortable: true },
        { key: 'unit', title: 'Einheit', sortable: true },
        // { key: 'is_system_text', title: 'Systemfeld'},
        // { key: 'is_required_text', title: 'Pflichtfeld'},
        // { key: 'is_frontend_visible_text', title: 'Sichtbar im Frontend'},
        // { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
        // { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true},
      ];
    }
    


    selectedRow(event: any){
      console.log(event);
      // this.selectedGroup = {
      //   id: event?.id,
      //   name: event?.name,
      //   icon: event?.icon,
      //   color: event?.color
      // }
      // this.mainNavbarService.setIconState('edit', true, false);
      // this.mainNavbarService.setIconState('delete', true, false);
    }

    sort(event: any){
      console.log(event)
    }
  
    filter(event: any){
      console.log(event)
    }


    ngOnDestroy() {
      // console.log('destroy Tariff-group')
      // this.reset()
      // this.tariffGroupService.resetData()
      // this.tariffGroupService.resetDetailedData()
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
}
