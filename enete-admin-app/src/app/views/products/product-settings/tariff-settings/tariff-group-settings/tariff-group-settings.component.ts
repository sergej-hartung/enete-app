import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Tablecolumn } from '../../../../../models/tablecolumn';
import { FilterOption } from '../../../../../shared/components/generic-table/generic-table.component';
import { TariffGroupService } from '../../../../../services/product/tariff/tariff-group.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MainNavbarService } from '../../../../../services/main-navbar.service';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../../../services/form.service';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreloaderService } from '../../../../../services/preloader.service';
import { NotificationService } from '../../../../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';

interface Error{
  requestType: string,
  errors: string[]
}

@Component({
  selector: 'app-tariff-group-settings',
  templateUrl: './tariff-group-settings.component.html',
  styleUrl: './tariff-group-settings.component.scss',
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
export class TariffGroupSettingsComponent {

  IsExpandable = false;
  groupEditOrNew = false;
  tariffGroupForm: FormGroup;
  selectedGroup: any = ''
  mode: any = ''

  
  private unsubscribe$ = new Subject<void>();

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

  @ViewChild('deleteTariffGroupTitleTemplate') deleteTariffGroupTitleTemplate!: TemplateRef<any>;
  @ViewChild('deleteTariffGroupMessageTemplate') deleteTariffGroupMessageTemplate!: TemplateRef<any>;

  @ViewChild('errorWhileDeletingTemplate') errorWhileDeletingTemplate!: TemplateRef<any>;

  constructor(
    public tariffGroupService: TariffGroupService,
    private mainNavbarService: MainNavbarService,
    private notificationService: NotificationService,
    private formService: FormService,
    private snackBar: MatSnackBar,
    private preloaderService: PreloaderService,
    private dialog: MatDialog
  ) {
    this.tariffGroupForm = this.formService.createTariffGroupFormGroup()

    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, true);
    this.mainNavbarService.setIconState('back', false, true);
    this.mainNavbarService.setIconState('edit', true, true);
    this.mainNavbarService.setIconState('delete', true, true);
  }
  
  ngOnInit() {
    this.tariffGroupService.fetchData()
    this.mainNavbarService.setIconState('new', true, false);

    this.tariffGroupService.errors$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(error => {
        console.log(error)
        if(error.requestType == 'patch'){
          this.preloaderService.hide();
          this.showSnackbar('Speichern der Tarifgruppe fehlgeschlagen', 'error-snackbar');
        }
        if(error.requestType == 'delete'){
          let errors: Error = error
          this.preloaderService.hide();
          this.showErrorDialog(errors?.errors)
        }
      });
      
    this.tariffGroupService.detailedData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => this.handleResponse(response));


    this.tariffGroupForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.updateSaveIconState());

    this.mainNavbarService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => action.proceedCallback())

    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(button => this.handleIconClick(button));

    this.tariffGroupService.deleteSuccess$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(deleted => {
        setTimeout(() => {
          this.preloaderService.hide();
          this.closeEditMode()
          this.showSnackbar('Tarifgruppe wurde erfolgreich gelöscht!', 'success-snackbar');
        }, 1000) 
      });
  }

  private handleResponse(response: any): void {
    console.log(response)
    if (!response || response.entityType !== 'tariffGroup') return;

    if (response.requestType === 'post') {
      this.tariffGroupService.fetchData()
      setTimeout(() => {
        this.preloaderService.hide();
        this.closeEditMode()
        this.showSnackbar('Tarifgruppe wurde erfolgreich gespeichert!', 'success-snackbar');
      }, 1000)    
    }else if (response.requestType === 'patch' && response.data) {

      if(response.data){
        const value = response.data
        this.selectedGroup = {
          id: value?.id,
          name: value?.name,
          icon: value?.icon,
          color: value?.color
        }
      }
      setTimeout(() => {
        this.preloaderService.hide();
        this.closeEditMode()
        this.showSnackbar('Tarifgruppe wurde erfolgreich geändert!', 'success-snackbar');
      }, 1000)
    }
  }

  private updateSaveIconState(): void {
    const isValid = this.tariffGroupForm.valid;
    if (isValid && this.mode === 'new') {
      this.mainNavbarService.setIconState('save', true, false);
    } else if (isValid && this.mode === 'edit') {
      if(!this.areObjectsEqual(this.selectedGroup, this.tariffGroupForm.value)){
        this.mainNavbarService.setIconState('save', true, false);
      }else{
        this.mainNavbarService.setIconState('save', true, true);
      }
    }
  }


  private handleIconClick(button: string): void {
    if (button === 'new') {
      this.mode = 'new';
      this.newGroup();
    } else if (button === 'edit') {
      this.mode = 'edit';
      this.editGroup();
    } else if (button === 'save') {
      this.saveGroup();
    } else if (button === 'delete'){
      //console.log('delete')
      this.showNotification(() => this.deleteGroup(this.selectedGroup?.id))
    }
  }

  private newGroup(){
    this.groupEditOrNew = true
    this.editMode()
  }
  
  private editGroup() {
    this.tariffGroupForm.patchValue({
      id: this.selectedGroup.id,
      name: this.selectedGroup.name,
      icon: this.selectedGroup.icon,
      color: this.selectedGroup.color
    })
    this.groupEditOrNew = true
    this.editMode()
  }

  private saveGroup(): void {
    this.groupEditOrNew = false;
    if (this.mode === 'new') {
      setTimeout(() => {
        this.tariffGroupService.addItem(this.tariffGroupForm.value)
        this.preloaderService.show('Creating')
        this.reset()
        this.selectedGroup = ''
      }, 350)
    } else if (this.mode === 'edit') {
      const id = this.tariffGroupForm.get('id')?.value;
      if (id) {
        setTimeout(() => {
          this.tariffGroupService.updateItem(id, this.tariffGroupForm.value)
          this.preloaderService.show('Updating')
          this.reset()
        }, 350)
      }
    }
  }

  private deleteGroup(id: number): void{
    if(id){
      this.tariffGroupService.deleteItem(id)
      this.preloaderService.show('Deleting')
      this.reset()
      this.selectedGroup = ''
      this.editMode()
    }
    
    console.log('delete')
  }
  
  closeGroup() {
    this.groupEditOrNew = false;
    this.closeEditMode()
  }


  sort(event: any){
    console.log(event)
  }

  filter(event: any){
    console.log(event)
  }
  
  selectedRow(event: any){
    this.selectedGroup = {
      id: event?.id,
      name: event?.name,
      icon: event?.icon,
      color: event?.color
    }
    this.mainNavbarService.setIconState('edit', true, false);
    this.mainNavbarService.setIconState('delete', true, false);
  }

  isRequired(control: AbstractControl | null): boolean {
    if (control && control.validator) {
      const validator = control.validator({} as AbstractControl);
      return validator && validator["required"];
    }
    return false;
  }

  reset(){
    this.mode = ''
    this.tariffGroupForm.reset()
    this.mainNavbarService.setIconState('save', true, true);
  }

  areObjectsEqual(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }

  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [panelClass]
    });
  }

  private showNotification(proceedCallback: () => void, tpl = this.deleteTariffGroupTitleTemplate, msg = this.deleteTariffGroupMessageTemplate) {
    this.notificationService.configureNotification(null, null, tpl, msg, 'Weiter', 'Abbrechen', proceedCallback, () => {});
    this.notificationService.showNotification();
  }
  
  private showErrorDialog(errors: string[]): void {
    this.dialog.open(this.errorWhileDeletingTemplate, {
      width: '500px',
      data: { errors }
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  editMode(){
    this.mainNavbarService.setIconState('new', true, true);
    this.mainNavbarService.setIconState('edit', true, true);
    this.mainNavbarService.setIconState('delete', true, true);
  }

  closeEditMode(){
    this.mainNavbarService.setIconState('new', true, false);
    if(this.selectedGroup){
      this.mainNavbarService.setIconState('edit', true, false);
      this.mainNavbarService.setIconState('delete', true, false);
    }
    
  }

  ngOnDestroy() {
    console.log('destroy Tariff-group')
    this.reset()

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
