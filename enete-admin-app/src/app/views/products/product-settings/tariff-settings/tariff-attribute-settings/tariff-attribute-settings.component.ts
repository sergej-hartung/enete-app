import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { TariffGroup } from '../../../../../models/tariff/group/group';
import { TariffGroupService } from '../../../../../services/product/tariff/tariff-group.service';
import { AttributeTypService } from '../../../../../services/product/tariff/attribute-typ/attribute-typ.service';
import { ObjectDiffService } from '../../../../../services/object-diff.service';

interface Error {
  requestType: string;
  errors: string[];
}

enum Mode {
  New = 'new',
  Edit = 'edit',
  None = ''
}

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
        state('partial', style({ width: '51%' })), // ca. 7 von 12 Spalten
        transition('full <=> partial', [animate('300ms ease-in-out')])
      ]),
    ]
})
export class TariffAttributeSettingsComponent implements OnInit, OnDestroy {

  isExpandable = false;
  attributeEditOrNew = false;
  isDropdown = false;
  isMultipleSelect = false;
  isTableLoading = false; // Neue Eigenschaft

  private initialFormValue: any;
  tariffAttributeForm: FormGroup;
  selectedAttribute: any = null; // TODO: Typisieren, z.B. TariffAttribute | null
  
  mode: Mode = Mode.None;
  tariffGroups: TariffGroup[] = [];
  inputTypes: any[] = [];

  attributeColumns: Tablecolumn[] = this.getDefaultColumns();
  filters: FilterOption[] = [
    { type: 'text', key: 'search', label: 'Suche' },
    { type: 'select', key: 'tariff_group_id', label: 'Tarifgruppe', options: [] }
  ];

  @ViewChild('deleteTariffAttributTitleTemplate') deleteTariffAttributTitleTemplate!: TemplateRef<any>;
  @ViewChild('deleteTariffAttributeMessageTemplate') deleteTariffAttributeMessageTemplate!: TemplateRef<any>;
  @ViewChild('errorWhileDeletingTemplate') errorWhileDeletingTemplate!: TemplateRef<any>;

  private unsubscribe$ = new Subject<void>();

  constructor(
    public tariffAttributeService: AttributeService,
    private attributeTypService: AttributeTypService,
    private mainNavbarService: MainNavbarService,
    private notificationService: NotificationService,
    private formService: FormService,
    public tariffGroupService: TariffGroupService,
    private snackBar: MatSnackBar,
    private preloaderService: PreloaderService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private objectDiffService: ObjectDiffService
  ) {
    this.tariffAttributeForm = this.formService.createTariffAttributeFormGroup();
    this.initializeNavbar();
  }

  ngOnInit() {
    this.fetchInitialData();
    this.setupSubscriptions();
    this.mainNavbarService.setIconState('new', true, false);
    this.watchFormChanges();

    this.tariffGroupService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => { 
        if(data){ 
          //this.productService.updateInitTariffDataLoaded('statuses', true);

          let item = this.filters.find(item => item.key === 'tariff_group_id')
          if(item && data.data.length > 0){
            let options:any  = [{label: 'alle', value: 'all', selected: true}]
            data.data.forEach(item => {
              let option ={
                label: item.name,
                value: item.id
              }
              options.push(option)
            })
            item.options = options
            //this.tariffStatusesLoaded = true
          }else if(item && data.data.length == 0){
            item.options = []
          }

        }    
      });

    this.tariffAttributeService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => this.handleAction(action));

    this.tariffAttributeService.deleteSuccess$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(deleted => {
        setTimeout(() => {
          this.preloaderService.hide();
          this.reset()
          this.selectedAttribute = ''
          //this.closeEditMode()
          this.showSnackbar('Das Tariffattribut wurde erfolgreich gelöscht.', 'success-snackbar');
        }, 1000) 
      });

    
    this.tariffAttributeService.errors$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(error => {
            console.log(error)
            if(error.requestType == 'post'){
              this.preloaderService.hide();
              this.showSnackbar('Speichern der Tarifgruppe fehlgeschlagen', 'error-snackbar');
            }
            if(error.requestType == 'patch'){
              this.preloaderService.hide();
              this.showSnackbar('Speichern der Tarifgruppe fehlgeschlagen', 'error-snackbar');
            }
            if(error.requestType == 'delete'){
              let errors: Error = error
              this.preloaderService.hide();
              //this.resetEditMode();
              this.showErrorDialog(errors?.errors)
            }
          });
  }

  ngOnDestroy() {
    this.reset();
    this.tariffAttributeService.resetData()
    this.tariffAttributeService.resetDetailedData()
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // Getter
  get tariffGroupsArray(): FormArray {
    return this.tariffAttributeForm.get('tariff_groups') as FormArray;
  }

  get detailsArray(): FormArray {
    return this.tariffAttributeForm.get('details') as FormArray;
  }

  // Initialisierungsmethoden
  private initializeNavbar(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, true);
    this.mainNavbarService.setIconState('back', false, true);
    this.mainNavbarService.setIconState('edit', true, true);
    this.mainNavbarService.setIconState('delete', true, true);
  }

  private fetchInitialData(): void {
    this.tariffAttributeService.fetchData();
    this.attributeTypService.fetchData();
  }

  private setupSubscriptions(): void {
    this.subscribeToTariffGroups();
    this.subscribeToAttributeTypes();
    this.subscribeToNavbarActions();
    this.subscribeToServiceResponse();
  }

  private subscribeToTariffGroups(): void {
    this.tariffGroupService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(groups => {
        if (groups?.requestType === 'get' && groups.entityType === 'tariffGroup') {
          this.tariffGroups = groups.data || [];
          this.updateTariffGroupsFormArray();
        } else if (!this.tariffGroups.length) {
          this.tariffGroupService.fetchData();
        }
      });
  }

  private subscribeToAttributeTypes(): void {
    this.attributeTypService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(types => this.inputTypes = types?.data || []);
  }

  private subscribeToNavbarActions(): void {
    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(button => this.handleIconClick(button));

    this.mainNavbarService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => action.proceedCallback());
  }

  private subscribeToServiceResponse(): void {
    this.tariffAttributeService.detailedData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (!response || response.entityType !== 'tariffAttribute') return;


        if (response.requestType === 'post') {
          this.tariffAttributeService.fetchData();
          const successMessage = 'Attribut wurde erfolgreich gespeichert!'
          setTimeout(() => {
            this.preloaderService.hide();
            this.selectedAttribute = null
            this.resetEditMode();
            this.showSnackbar(successMessage, 'success-snackbar');
          }, 1000);
        }

        if(response.requestType === 'patch' && response.data){
          this.selectedAttribute = response.requestType === 'patch' ? response.data : null;
          const successMessage = 'Attribut wurde erfolgreich geändert!'
          setTimeout(() => {
            this.preloaderService.hide();
            this.resetEditMode();
            this.showSnackbar(successMessage, 'success-snackbar');
          }, 1000);
        }
      });
  }

  // Formular-Änderungen überwachen
  private watchFormChanges(): void {
    this.tariffAttributeForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (!this.tariffAttributeForm.valid) return;


        this.mainNavbarService.setIconState('save', true, this.mode !== 'new' && !this.hasFormChanges());
      });
  }

  private hasFormChanges(): boolean {
    return this.mode === 'edit' && this.objectDiffService.hasDifferences(
      this.initialFormValue,
      this.tariffAttributeForm.getRawValue()
    );
  }

  // Ereignishandler
  private handleIconClick(button: string): void {
    console.log(button)
    switch (button) {
      case 'new':
        this.startNewAttribute();
        break;
      case 'edit':
        this.editAttribute();
        break;
      case 'save':
        this.saveAttribute();
        break;
      case 'delete':
        
        this.showNotification(() => this.deleteAttribut(this.selectedAttribute?.id))
        break;
      // case 'delete': Implementierung fehlt noch
    }
  }

  private handleInputTypeChange(inputId: any): void {
    const inputType = this.inputTypes.find(type => type.id == inputId);
    const wasDropdownOrMultiple = this.isDropdown || this.isMultipleSelect; // Vorheriger Zustand
    this.isDropdown = inputType?.name === 'Dropdown';
    this.isMultipleSelect = inputType?.name === 'Mehrfachauswahl';
    
    // Logik für Dropdown oder Mehrfachauswahl
    if (this.isDropdown || this.isMultipleSelect) {
      // Wenn vorher kein Dropdown/Mehrfachauswahl war oder details leer sind,
      // füge ein leeres Feld hinzu
      if (!wasDropdownOrMultiple || this.detailsArray.length === 0) {
        this.addNewDetailOption();
      }
    } else {
      // Wenn der Typ nicht Dropdown/Mehrfachauswahl ist, leere die Details
      this.detailsArray.clear();
    }
  }

  // Formular-Array Verwaltung
  private updateTariffGroupsFormArray(): void {
    this.tariffGroupsArray.clear();
    this.tariffGroups.forEach(group => {
      this.tariffGroupsArray.push(this.fb.group({
        id: [group.id],
        name: [group.name],
        icon: [group.icon],
        color: [group.color],
        checked: [false]
      }));
    });
  }

  private updateTariffGroupsFormArrayWithSelected(selectedIds: number[]): void {
    this.tariffGroupsArray.clear();
    this.tariffGroups.forEach(group => {
      this.tariffGroupsArray.push(this.fb.group({
        id: [group.id],
        name: [group.name],
        icon: [group.icon],
        color: [group.color],
        checked: [selectedIds.includes(group.id)]
      }));
    });
  }

  addNewDetailOption(): void {
    this.detailsArray.push(this.fb.group({
      name: ['', Validators.required]
    }));
  }

  deleteDetailOption(index: number): void {
    if (index >= 0 && index < this.detailsArray.length) {
      this.detailsArray.removeAt(index);
    }
  }

  // Komponenten-Aktionen
  startNewAttribute(): void {
    this.mode = Mode.New;
    this.attributeEditOrNew = true;
    this.attributeColumns = this.getEditColumns();
    this.resetForm(); // Setzt das Formular zurück, inkl. detailsArray.clear()
    this.subscribeToInputTypeChanges();
    this.editMode();

    //this.watchFormChanges();
  }

  editAttribute(): void {
    console.log(this.selectedAttribute)
    if (!this.selectedAttribute) return;
  
    this.attributeEditOrNew = true;
    this.attributeColumns = this.getEditColumns();
  
    this.tariffAttributeForm.patchValue({
      id: this.selectedAttribute.id,
      code: this.selectedAttribute.code,
      name: this.selectedAttribute.name,
      input_type_id: this.selectedAttribute.input_type_id.toString(),
      unit: this.selectedAttribute.unit,
      is_system: !!this.selectedAttribute.is_system,
      is_required: !!this.selectedAttribute.is_required,
      is_frontend_visible: !!this.selectedAttribute.is_frontend_visible
    });
  
    this.updateTariffGroupsFormArrayWithSelected(this.selectedAttribute.tariff_group_ids || []);
    const details = JSON.parse(this.selectedAttribute.details || '[]');
    this.detailsArray.clear();
    details.forEach((detail: any) => this.addNewDetailOptionWithValue(detail.name));
  
    // Prüfe, ob ein leeres Feld hinzugefügt werden soll
    const inputType = this.inputTypes.find(type => type.id === this.selectedAttribute.input_type_id);
    this.isDropdown = inputType?.name === 'Dropdown';
    this.isMultipleSelect = inputType?.name === 'Mehrfachauswahl';
    if ((this.isDropdown || this.isMultipleSelect) && this.detailsArray.length === 0) {
      this.addNewDetailOption();
    }
  
    this.initialFormValue = JSON.parse(JSON.stringify(this.tariffAttributeForm.getRawValue()));
    console.log(this.initialFormValue)
    this.subscribeToInputTypeChanges();

    this.mode = Mode.Edit;
    this.editMode();

    //this.watchFormChanges();
  }

  private addNewDetailOptionWithValue(value: string): void {
    this.detailsArray.push(this.fb.group({
      name: [value, Validators.required]
    }));
  }

  saveAttribute(): void {
    if (!this.tariffAttributeForm.valid) return;

    const formValue = this.tariffAttributeForm.getRawValue();
    this.preloaderService.show(this.mode === 'new' ? 'Creating' : 'Updating');

    if (this.mode === 'new') {
      this.tariffAttributeService.addItem(formValue);
    } else if (this.mode === 'edit') {
      const changes = this.objectDiffService.getDifferences(this.initialFormValue, formValue);
      this.tariffAttributeService.updateItem(formValue.id, changes);
    }

    this.closeGroup();
  }

  deleteAttribut(id: number){
    if(id){
      this.tariffAttributeService.deleteItem(id)
      this.preloaderService.show('Deleting')
      // this.reset()
      // this.selectedAttribute = ''

    }
    
    console.log('delete')
  }

  closeGroup(): void {
    this.mode = Mode.None;
    this.attributeEditOrNew = false;
    this.attributeColumns = this.getDefaultColumns();
    this.resetForm();
    this.resetEditMode();
  }

  // Hilfsmethoden
  private getDefaultColumns(): Tablecolumn[] {
    return [
      { key: 'id', title: '#', sortable: true },
      { key: 'code', title: 'Kennung', sortable: true },
      { key: 'name', title: 'Name', sortable: true },
      { key: 'input_type', title: 'Typ', sortable: true },
      { key: 'unit', title: 'Einheit', sortable: true },
      { key: 'is_system_text', title: 'Systemfeld' },
      { key: 'is_required_text', title: 'Pflichtfeld' },
      { key: 'is_frontend_visible_text', title: 'Sichtbar im Frontend' },
      { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
      { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true }
    ];
  }

  private getEditColumns(): Tablecolumn[] {
    return [
      { key: 'id', title: '#', sortable: true },
      { key: 'code', title: 'Code', sortable: true },
      { key: 'name', title: 'Name', sortable: true },
      { key: 'input_type', title: 'Typ', sortable: true },
      { key: 'unit', title: 'Einheit', sortable: true }
    ];
  }

  private resetEditMode(): void {
    this.mainNavbarService.setIconState('new', true, false);
    if (this.selectedAttribute) {
      this.mainNavbarService.setIconState('edit', true, false);
      this.mainNavbarService.setIconState('delete', true, false);
    }
    this.mainNavbarService.setIconState('save', true, true);
  }

  private resetForm(): void {
    this.tariffAttributeForm.reset({
      id: null,
      code: '',
      name: '',
      input_type_id: null,
      unit: '',
      is_system: false,
      is_required: false,
      is_frontend_visible: false
    });
    this.updateTariffGroupsFormArray();
    this.detailsArray.clear();
  }

  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [panelClass]
    });
  }

  private subscribeToInputTypeChanges(): void {
    this.tariffAttributeForm.get('input_type_id')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(inputId => {
        this.handleInputTypeChange(inputId);
      });
  }

  editMode(): void {
    this.mainNavbarService.setIconState('new', true, true);
    this.mainNavbarService.setIconState('edit', true, true);
    this.mainNavbarService.setIconState('delete', true, true);
    this.mainNavbarService.setIconState('save', true, true);
  }

  reset(): void {
    this.mode = Mode.None;
    this.tariffAttributeForm.reset();
    this.mainNavbarService.setIconState('save', true, true);
  }

  // Tabellen-Ereignishandler
  selectedRow(event: any): void {
    this.selectedAttribute = event;
    this.mainNavbarService.setIconState('edit', true, false);
    this.mainNavbarService.setIconState('delete', true, false);
  }



  isRequired(control: AbstractControl | null): boolean {
    // Prüft ob ein Feld erforderlich ist
    return !!control?.validator?.({} as AbstractControl)?.['required'];
  }



  sort(event: any): void {
    if(!this.attributeEditOrNew){
      this.tariffAttributeService.fetchData(event)
    }
  }

  filter(event: any): void {
    if(!this.attributeEditOrNew){
      this.tariffAttributeService.fetchData(event)
    }
  }

  private handleAction(action: any): void {
    console.log(action)
    switch (action.action) {
      // case 'deletePartnerFile':
      //   this.showNotification(action.proceedCallback, this.deleteFileTitleTemplate, this.deleteFileMessageTemplate);
      //   break;
      case 'selectRow':
      case 'sort':
      case 'filter':
        action.proceedCallback();
        break;
      default:
        action.proceedCallback();
    }
  }

  private showNotification(proceedCallback: () => void, tpl = this.deleteTariffAttributTitleTemplate, msg = this.deleteTariffAttributeMessageTemplate) {
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
}
