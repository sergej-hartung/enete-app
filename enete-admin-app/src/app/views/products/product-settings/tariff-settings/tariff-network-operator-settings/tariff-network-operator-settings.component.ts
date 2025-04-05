import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterOption } from '../../../../../shared/components/generic-table/generic-table.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NetworkOperator } from '../../../../../models/tariff/network-operator/network-operator';
import { TariffGroup } from '../../../../../models/tariff/group/group';
import { Tablecolumn } from '../../../../../models/tablecolumn';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, debounceTime, of, Subject, takeUntil } from 'rxjs';
import { MainNavbarService } from '../../../../../services/main-navbar.service';
import { NotificationService } from '../../../../../services/notification.service';
import { FormService } from '../../../../../services/form.service';
import { TariffGroupService } from '../../../../../services/product/tariff/tariff-group.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreloaderService } from '../../../../../services/preloader.service';
import { MatDialog } from '@angular/material/dialog';
import { ObjectDiffService } from '../../../../../services/object-diff.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductDocumentService } from '../../../../../services/product/product-document.service';
import { NetworkOperatorService } from '../../../../../services/product/tariff/network-operator/network-operator.service';
import { FileData, FileManagerModalComponent } from '../../../../../shared/components/file-manager-modal/file-manager-modal.component';

interface NetworkOperatorForm {
  id: FormControl<number | null>;
  name: FormControl<string>;
  logo_id: FormControl<number | null>;
  file_name: FormControl<string>;
  tariff_groups: FormArray<FormGroup<{
    id: FormControl<number>;
    name: FormControl<string>;
    icon: FormControl<string>;
    color: FormControl<string>;
    checked: FormControl<boolean>;
  }>>;
}

interface Error {
  requestType: string;
  errors: string[];
}

enum Mode {
  New = 'new',
  Edit = 'edit',
  None = ''
}

const DEFAULT_FILTERS: FilterOption[] = [
  { type: 'text', key: 'search', label: 'Suche' },
  { type: 'select', key: 'tariff_group_id', label: 'Tarifgruppe', options: [] }
];

@Component({
  selector: 'app-tariff-network-operator-settings',
  templateUrl: './tariff-network-operator-settings.component.html',
  styleUrl: './tariff-network-operator-settings.component.scss',
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
export class TariffNetworkOperatorSettingsComponent {

  isExpandable = false;
  networkOperatorEditOrNew = false;
  private initialFormValue: any;
  networkOperatorForm: FormGroup<NetworkOperatorForm>;
  selectedNetworkOperator: NetworkOperator | null = null;
  mode: Mode = Mode.None;
  tariffGroups: TariffGroup[] = [];
  networkOperatorColumns: Tablecolumn[] = this.getDefaultColumns();
  filters: FilterOption[] = DEFAULT_FILTERS;
  mimeType = 'image/';
  logoNetworkOperatorContent: SafeResourceUrl | null = null;

  @ViewChild('deleteNetworkOperatorTitleTemplate') deleteNetworkOperatorTitleTemplate!: TemplateRef<any>;
  @ViewChild('deleteNetworkOperatorMessageTemplate') deleteNetworkOperatorMessageTemplate!: TemplateRef<any>;
  @ViewChild('errorWhileDeletingTemplate') errorWhileDeletingTemplate!: TemplateRef<any>;

  private unsubscribe$ = new Subject<void>();

  constructor(
    public networkOperatorService: NetworkOperatorService,
    private mainNavbarService: MainNavbarService,
    private notificationService: NotificationService,
    private formService: FormService,
    public tariffGroupService: TariffGroupService,
    private snackBar: MatSnackBar,
    private preloaderService: PreloaderService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private objectDiffService: ObjectDiffService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private productDocumentService: ProductDocumentService,
  ) {
    this.networkOperatorForm = this.formService.createTariffNetworkOperatorFormGroup() as FormGroup<NetworkOperatorForm>;
    this.initializeNavbar();
    //this.setupDynamicValidators();
  }

  ngOnInit(): void {
    this.fetchInitialData();
    this.setupSubscriptions();
    this.watchFormChanges();
  }

  get tariffGroupsArray(): FormArray<FormGroup> {
    return this.networkOperatorForm.get('tariff_groups') as FormArray<FormGroup>;
  }

  private initializeNavbar(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, false);
    this.mainNavbarService.setIconState('back', false, true);
    this.mainNavbarService.setIconState('edit', true, true);
    this.mainNavbarService.setIconState('delete', true, true);
  }

  private fetchInitialData(): void {
      this.networkOperatorService.fetchData();
    }
  
    private setupSubscriptions(): void {
      this.subscribeToTariffGroups();
      this.subscribeToNavbarActions();
      this.subscribeToServiceResponse();
      this.subscribeToNetworkOperatorEvents();
    }
  
    private subscribeToTariffGroups(): void {
      this.tariffGroupService.data$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
          if (!data) return;
          this.tariffGroups = data.data || [];
          this.updateTariffGroupsFormArray();
          this.updateFilterOptions(data.data);
        });
    }
  
    private updateFilterOptions(groups: TariffGroup[]): void {
      const tariffFilter = this.filters.find(f => f.key === 'tariff_group_id');
      if (!tariffFilter) return;
      tariffFilter.options = [
        { label: 'alle', value: 'all', selected: true },
        ...groups.map(group => ({ label: group.name, value: group.id }))
      ];
    }
  
    private updateTariffGroupsFormArray(): void {
      this.tariffGroupsArray.clear();
      this.tariffGroups.forEach(group => {
        this.tariffGroupsArray.push(this.fb.group({
          id: this.fb.control(group.id),
          name: this.fb.control(group.name),
          icon: this.fb.control(group.icon),
          color: this.fb.control(group.color),
          checked: this.fb.control(false)
        }));
      });
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
      this.networkOperatorService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          if (!response || response.entityType !== 'tariffNetworkOperator') return;
          this.handleServiceResponse(response);
        });
    }
  
    private subscribeToNetworkOperatorEvents(): void {
      this.networkOperatorService.confirmAction$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(action => action.proceedCallback());
  
      this.networkOperatorService.deleteSuccess$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          setTimeout(() => {
            this.preloaderService.hide();
            this.reset();
            this.selectedNetworkOperator = null;
            this.showSnackbar('Der Netzbetreiber wurde erfolgreich gelöscht.', 'success-snackbar');
          }, 1000);
        });
  
      this.networkOperatorService.errors$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(error => this.handleServiceError(error));
    }
  
    private handleServiceResponse(response: any): void {
      if (response.requestType === 'post') {
        this.handlePostSuccess();
      } else if (response.requestType === 'patch' && response.data) {
        this.handlePatchSuccess(response.data);
      }
    }
  
    private handlePostSuccess(): void {
      this.networkOperatorService.fetchData();
      setTimeout(() => {
        this.preloaderService.hide();
        this.selectedNetworkOperator = null;
        this.logoNetworkOperatorContent = null;
        this.resetEditMode();
        this.showSnackbar('Netzbetreiber wurde erfolgreich gespeichert!', 'success-snackbar');
      }, 1000);
    }
  
    private handlePatchSuccess(data: NetworkOperator): void {
      this.selectedNetworkOperator = data;
      setTimeout(() => {
        this.preloaderService.hide();
        this.resetEditMode();
        this.showSnackbar('Netzbetreiber wurde erfolgreich geändert!', 'success-snackbar');
      }, 1000);
    }
  
    private handleServiceError(error: Error): void {
      this.preloaderService.hide();
      switch (error.requestType) {
        case 'post':
        case 'patch':
          this.showSnackbar('Speichern des Netzbetreiber fehlgeschlagen', 'error-snackbar');
          break;
        case 'delete':
          this.showErrorDialog(error.errors);
          break;
      }
    }
  
    private handleIconClick(button: string): void {
      switch (button) {
        case 'new':
          this.startNewNetworkOperator();
          break;
        case 'edit':
          this.editNetworkOperator();
          break;
        case 'save':
          this.saveNetworkOperator();
          break;
        case 'delete':
          if (this.selectedNetworkOperator?.id) {
            this.showNotification(() => this.deleteNetworkOperator(this.selectedNetworkOperator!.id));
          }
          break;
      }
    }
  
    startNewNetworkOperator(): void {
      this.mode = Mode.New;
      this.networkOperatorEditOrNew = true;
      this.networkOperatorColumns = this.getEditColumns();
      this.resetForm();
      this.editMode();
    }
  
    editNetworkOperator(): void {
      if (!this.selectedNetworkOperator) return;
  
      this.networkOperatorColumns = this.getEditColumns();
      this.networkOperatorEditOrNew = true;
  
      if (this.selectedNetworkOperator.logo_id) {
        this.getLogoNetworkOperator(this.selectedNetworkOperator.logo_id);
        this.networkOperatorForm.patchValue({ file_name: this.selectedNetworkOperator.file_name || '' });
      }
  
      this.networkOperatorForm.patchValue({
        id: this.selectedNetworkOperator.id,
        name: this.selectedNetworkOperator.name || '',
        logo_id: this.selectedNetworkOperator.logo_id || null
      });
  
      this.updateTariffGroupsFormArrayWithSelected(this.selectedNetworkOperator.tariff_group_ids ?? []);
      this.initialFormValue = structuredClone(this.networkOperatorForm.getRawValue());
      this.mode = Mode.Edit;
      this.editMode();
    }
  
    saveNetworkOperator(): void {
      if (!this.networkOperatorForm.valid) return;
  
      const formValue = this.networkOperatorForm.getRawValue();
      this.preloaderService.show(this.mode === Mode.New ? 'Creating' : 'Updating');
  
      if (this.mode === Mode.New) {
        this.networkOperatorService.addItem(formValue);
      } else if (this.mode === Mode.Edit) {
        const changes = this.objectDiffService.getDifferences(this.initialFormValue, formValue);
        this.networkOperatorService.updateItem(formValue.id!, changes);
        this.logoNetworkOperatorContent = null;
      }
  
      this.closeGroup();
    }
  
    deleteNetworkOperator(id: number): void {
      this.networkOperatorService.deleteItem(id);
      this.preloaderService.show('Deleting');
    }
  
    private editMode(): void {
      this.mainNavbarService.setIconState('new', true, true);
      this.mainNavbarService.setIconState('edit', true, true);
      this.mainNavbarService.setIconState('delete', true, true);
      this.mainNavbarService.setIconState('save', true, true);
    }
  
    private updateTariffGroupsFormArrayWithSelected(selectedIds: number[]): void {
      this.tariffGroupsArray.clear();
      this.tariffGroups.forEach(group => {
        this.tariffGroupsArray.push(this.fb.group({
          id: this.fb.control(group.id),
          name: this.fb.control(group.name),
          icon: this.fb.control(group.icon),
          color: this.fb.control(group.color),
          checked: this.fb.control(selectedIds.includes(group.id))
        }));
      });
    }
  
    private getDefaultColumns(): Tablecolumn[] {
      return [
        { key: 'id', title: '#', sortable: true },
        { key: 'name', title: 'Name', sortable: true },
        { key: 'logo_id', title: 'Logo-Id', sortable: true },
        { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
        { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true }
      ];
    }
  
    private getEditColumns(): Tablecolumn[] {
      return [
        { key: 'id', title: '#', sortable: false },
        { key: 'name', title: 'Name', sortable: false },
        { key: 'logo_id', title: 'Logo-Id', sortable: false },
        // { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
        // { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true }
      ];
    }
  
    selectedRow(event: NetworkOperator): void {
      this.selectedNetworkOperator = event;
      this.mainNavbarService.setIconState('edit', true, false);
      this.mainNavbarService.setIconState('delete', true, false);
    }
  
    isRequired(control: AbstractControl | null): boolean {
      return !!control?.validator?.({} as AbstractControl)?.['required'];
    }
  
    sort(event: any): void {
      if (!this.networkOperatorEditOrNew) {
        this.networkOperatorService.fetchData(event);
      }
    }
  
    filter(event: any): void {
      if (!this.networkOperatorEditOrNew) {
        this.networkOperatorService.fetchData(event);
      }
    }
  
    closeDialog(): void {
      this.dialog.closeAll();
    }
  
    closeGroup(): void {
      this.mode = Mode.None;
      this.networkOperatorEditOrNew = false;
      this.networkOperatorColumns = this.getDefaultColumns();
      this.resetForm();
      this.logoNetworkOperatorContent = null;
      this.resetEditMode();
    }
    
    private resetForm(): void {
      this.networkOperatorForm.reset({
        id: null,
        name: '',
        logo_id: null,
        file_name: ''
      });
      this.updateTariffGroupsFormArray();
    }
  
    private resetEditMode(): void {
      this.mainNavbarService.setIconState('new', true, false);
      if (this.selectedNetworkOperator) {
        this.mainNavbarService.setIconState('edit', true, false);
        this.mainNavbarService.setIconState('delete', true, false);
      }
      this.mainNavbarService.setIconState('save', true, true);
    }
  
    openModal(event: Event): void {
      event.preventDefault();
      (event.target as HTMLElement).blur();
  
      const modalRef = this.modalService.open(FileManagerModalComponent, {
        windowClass: 'file-manager-modal',
        backdropClass: 'file-manager-modal-backdrop',
        size: 'lg'
      });
  
      modalRef.componentInstance.mimeType = this.mimeType;
      modalRef.componentInstance.fileSelected
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((selectedFile: FileData) => this.handleFileSelected(selectedFile));
    }
  
    private showNotification(proceedCallback: () => void): void {
      this.notificationService.configureNotification(
        null,
        null,
        this.deleteNetworkOperatorTitleTemplate,
        this.deleteNetworkOperatorMessageTemplate,
        'Weiter',
        'Abbrechen',
        proceedCallback,
        () => {}
      );
      this.notificationService.showNotification();
    }
  
    private showSnackbar(message: string, panelClass: string): void {
      this.snackBar.open(message, '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: [panelClass]
      });
    }
  
    private showErrorDialog(errors: string[]): void {
      this.dialog.open(this.errorWhileDeletingTemplate, {
        width: '500px',
        data: { errors }
      });
    }
  
    handleFileSelected(file: FileData): void {
      this.networkOperatorForm.patchValue({
        logo_id: file.id,
        file_name: file.name
      });
      this.getLogoNetworkOperator(file.id);
    }
  
    getLogoNetworkOperator(id: number): void {
      this.productDocumentService.getFileContentById(id)
        .pipe(
          takeUntil(this.unsubscribe$),
          catchError(err => {
            this.showSnackbar('Fehler beim Laden des Logos', 'error-snackbar');
            return of(null);
          })
        )
        .subscribe(content => {
          if (!content) return;
          const url = window.URL.createObjectURL(content);
          this.logoNetworkOperatorContent = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#view=FitH');
        });
    }
  
    private watchFormChanges(): void {
      this.networkOperatorForm.valueChanges
        .pipe(
          debounceTime(300),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(() => {
          if (!this.networkOperatorForm.valid) return;
          this.mainNavbarService.setIconState('save', true, this.mode !== Mode.New && !this.hasFormChanges());
        });
    }
  
    private hasFormChanges(): boolean {
      return this.mode === Mode.Edit && this.objectDiffService.hasDifferences(
        this.initialFormValue,
        this.networkOperatorForm.getRawValue()
      );
    }
  
    reset(): void {
      this.mode = Mode.None;
      this.networkOperatorForm.reset();
      this.mainNavbarService.setIconState('save', true, true);
    }
  
    ngOnDestroy(): void {
      this.reset();
      this.networkOperatorService.resetData();
      this.networkOperatorService.resetDetailedData();
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

}
