import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TariffGroup } from '../../../../../models/tariff/group/group';
import { Tablecolumn } from '../../../../../models/tablecolumn';
import { FilterOption } from '../../../../../shared/components/generic-table/generic-table.component';
import { catchError, debounceTime, of, Subject, takeUntil } from 'rxjs';
import { MainNavbarService } from '../../../../../services/main-navbar.service';
import { NotificationService } from '../../../../../services/notification.service';
import { FormService } from '../../../../../services/form.service';
import { TariffGroupService } from '../../../../../services/product/tariff/tariff-group.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreloaderService } from '../../../../../services/preloader.service';
import { MatDialog } from '@angular/material/dialog';
import { ObjectDiffService } from '../../../../../services/object-diff.service';
import { ProviderService } from '../../../../../services/product/tariff/provider/provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileData, FileManagerModalComponent } from '../../../../../shared/components/file-manager-modal/file-manager-modal.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProductDocumentService } from '../../../../../services/product/product-document.service';
import { Provider } from '../../../../../models/tariff/provider/provider';

interface TariffProviderForm {
  id: FormControl<number | null>;
  name: FormControl<string>;
  logo_id: FormControl<number | null>;
  file_name: FormControl<string>;
  is_filled_on_site: FormControl<boolean>;
  external_fill_link: FormControl<string | null>;
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
  selector: 'app-tariff-provider-settings',
  templateUrl: './tariff-provider-settings.component.html',
  styleUrl: './tariff-provider-settings.component.scss',
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
export class TariffProviderSettingsComponent {

  isExpandable = false;
  providerEditOrNew = false;
  private initialFormValue: any;
  tariffProviderForm: FormGroup<TariffProviderForm>;
  selectedProvider: Provider | null = null;
  mode: Mode = Mode.None;
  tariffGroups: TariffGroup[] = [];
  providerColumns: Tablecolumn[] = this.getDefaultColumns();
  filters: FilterOption[] = DEFAULT_FILTERS;
  mimeType = 'image/';
  logoProviderContent: SafeResourceUrl | null = null;

  @ViewChild('deleteTariffProviderTitleTemplate') deleteTariffProviderTitleTemplate!: TemplateRef<any>;
  @ViewChild('deleteTariffProviderMessageTemplate') deleteTariffProviderMessageTemplate!: TemplateRef<any>;
  @ViewChild('errorWhileDeletingTemplate') errorWhileDeletingTemplate!: TemplateRef<any>;

  private unsubscribe$ = new Subject<void>();

  constructor(
    public providerService: ProviderService,
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
    this.tariffProviderForm = this.formService.createTariffProviderFormGroup() as FormGroup<TariffProviderForm>;
    this.initializeNavbar();
    this.setupDynamicValidators();
  }

  ngOnInit(): void {
    this.fetchInitialData();
    this.setupSubscriptions();
    this.watchFormChanges();
  }

  get tariffGroupsArray(): FormArray<FormGroup> {
    return this.tariffProviderForm.get('tariff_groups') as FormArray<FormGroup>;
  }

  private initializeNavbar(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, false);
    this.mainNavbarService.setIconState('back', false, true);
    this.mainNavbarService.setIconState('edit', true, true);
    this.mainNavbarService.setIconState('delete', true, true);
  }

  private setupDynamicValidators(): void {
    const isFilledOnSiteControl = this.tariffProviderForm.get('is_filled_on_site');
    const externalFillLinkControl = this.tariffProviderForm.get('external_fill_link');

    if (!isFilledOnSiteControl || !externalFillLinkControl) return;

    // Initialer Zustand setzen
    this.updateExternalLinkValidator(isFilledOnSiteControl.value);

    // Änderungen an is_filled_on_site überwachen
    isFilledOnSiteControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: boolean) => {
        this.updateExternalLinkValidator(value);
      });
  }

  private updateExternalLinkValidator(isFilledOnSite: boolean): void {
    const externalFillLinkControl = this.tariffProviderForm.get('external_fill_link');
    if (!externalFillLinkControl) return;

    if (!isFilledOnSite) {
      // Wenn is_filled_on_site false ist, Validator hinzufügen
      externalFillLinkControl.setValidators([Validators.required]);
    } else {
      // Wenn is_filled_on_site true ist, Validator entfernen und Feld leeren
      externalFillLinkControl.clearValidators();
      externalFillLinkControl.setValue('');
    }

    // Validator-Status aktualisieren
    externalFillLinkControl.updateValueAndValidity();
  }

  private fetchInitialData(): void {
    this.providerService.fetchData();
  }

  private setupSubscriptions(): void {
    this.subscribeToTariffGroups();
    this.subscribeToNavbarActions();
    this.subscribeToServiceResponse();
    this.subscribeToProviderEvents();
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
    this.providerService.detailedData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (!response || response.entityType !== 'tariffProvider') return;
        this.handleServiceResponse(response);
      });
  }

  private subscribeToProviderEvents(): void {
    this.providerService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => action.proceedCallback());

    this.providerService.deleteSuccess$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => {
          this.preloaderService.hide();
          this.reset();
          this.selectedProvider = null;
          this.showSnackbar('Der Provider wurde erfolgreich gelöscht.', 'success-snackbar');
        }, 1000);
      });

    this.providerService.errors$
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
    this.providerService.fetchData();
    setTimeout(() => {
      this.preloaderService.hide();
      this.selectedProvider = null;
      this.logoProviderContent = null;
      this.resetEditMode();
      this.showSnackbar('Provider wurde erfolgreich gespeichert!', 'success-snackbar');
    }, 1000);
  }

  private handlePatchSuccess(data: Provider): void {
    this.selectedProvider = data;
    setTimeout(() => {
      this.preloaderService.hide();
      this.resetEditMode();
      this.showSnackbar('Provider wurde erfolgreich geändert!', 'success-snackbar');
    }, 1000);
  }

  private handleServiceError(error: Error): void {
    this.preloaderService.hide();
    switch (error.requestType) {
      case 'post':
      case 'patch':
        this.showSnackbar('Speichern des Providers fehlgeschlagen', 'error-snackbar');
        break;
      case 'delete':
        this.showErrorDialog(error.errors);
        break;
    }
  }

  private handleIconClick(button: string): void {
    switch (button) {
      case 'new':
        this.startNewProvider();
        break;
      case 'edit':
        this.editProvider();
        break;
      case 'save':
        this.saveProvider();
        break;
      case 'delete':
        if (this.selectedProvider?.id) {
          this.showNotification(() => this.deleteProvider(this.selectedProvider!.id));
        }
        break;
    }
  }

  startNewProvider(): void {
    this.mode = Mode.New;
    this.providerEditOrNew = true;
    this.providerColumns = this.getEditColumns();
    this.resetForm();
    this.editMode();
  }

  editProvider(): void {
    if (!this.selectedProvider) return;

    this.providerColumns = this.getEditColumns();
    this.providerEditOrNew = true;

    if (this.selectedProvider.logo_id) {
      this.getLogoProvider(this.selectedProvider.logo_id);
      this.tariffProviderForm.patchValue({ file_name: this.selectedProvider.file_name || '' });
    }

    this.tariffProviderForm.patchValue({
      id: this.selectedProvider.id,
      name: this.selectedProvider.name || '',
      logo_id: this.selectedProvider.logo_id || null,
      is_filled_on_site: this.selectedProvider.is_filled_on_site ?? true,
      external_fill_link: this.selectedProvider.external_fill_link || ''
    });

    this.updateTariffGroupsFormArrayWithSelected(this.selectedProvider.tariff_group_ids ?? []);
    this.initialFormValue = structuredClone(this.tariffProviderForm.getRawValue());
    this.mode = Mode.Edit;
    this.editMode();
  }

  saveProvider(): void {
    if (!this.tariffProviderForm.valid) return;

    const formValue = this.tariffProviderForm.getRawValue();
    this.preloaderService.show(this.mode === Mode.New ? 'Creating' : 'Updating');

    if (this.mode === Mode.New) {
      this.providerService.addItem(formValue);
    } else if (this.mode === Mode.Edit) {
      const changes = this.objectDiffService.getDifferences(this.initialFormValue, formValue);
      this.providerService.updateItem(formValue.id!, changes);
      this.logoProviderContent = null;
    }

    this.closeGroup();
  }

  deleteProvider(id: number): void {
    this.providerService.deleteItem(id);
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
      { key: 'is_filled_on_site_text', title: 'Auf unsere Seite ausfüllen?', sortable: false },
      { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
      { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true }
    ];
  }

  private getEditColumns(): Tablecolumn[] {
    return [
      { key: 'id', title: '#', sortable: false },
      { key: 'name', title: 'Name', sortable: false },
      { key: 'logo_id', title: 'Logo-Id', sortable: false },
      { key: 'is_filled_on_site_text', title: 'Auf unsere Seite ausfüllen?', sortable: false },
    ];
  }

  selectedRow(event: Provider): void {
    this.selectedProvider = event;
    this.mainNavbarService.setIconState('edit', true, false);
    this.mainNavbarService.setIconState('delete', true, false);
  }

  isRequired(control: AbstractControl | null): boolean {
    return !!control?.validator?.({} as AbstractControl)?.['required'];
  }

  sort(event: any): void {
    if (!this.providerEditOrNew) {
      this.providerService.fetchData(event);
    }
  }

  filter(event: any): void {
    if (!this.providerEditOrNew) {
      this.providerService.fetchData(event);
    }
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  closeGroup(): void {
    this.mode = Mode.None;
    this.providerEditOrNew = false;
    this.providerColumns = this.getDefaultColumns();
    this.resetForm();
    this.logoProviderContent = null;
    this.resetEditMode();
  }
  
  private resetForm(): void {
    this.tariffProviderForm.reset({
      id: null,
      name: '',
      logo_id: null,
      file_name: '',
      is_filled_on_site: true,
      external_fill_link: ''
    });
    this.updateTariffGroupsFormArray();
  }

  private resetEditMode(): void {
    this.mainNavbarService.setIconState('new', true, false);
    if (this.selectedProvider) {
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
      this.deleteTariffProviderTitleTemplate,
      this.deleteTariffProviderMessageTemplate,
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
    this.tariffProviderForm.patchValue({
      logo_id: file.id,
      file_name: file.name
    });
    this.getLogoProvider(file.id);
  }

  getLogoProvider(id: number): void {
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
        this.logoProviderContent = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#view=FitH');
      });
  }

  private watchFormChanges(): void {
    this.tariffProviderForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        if (!this.tariffProviderForm.valid) return;
        this.mainNavbarService.setIconState('save', true, this.mode !== Mode.New && !this.hasFormChanges());
      });
  }

  private hasFormChanges(): boolean {
    return this.mode === Mode.Edit && this.objectDiffService.hasDifferences(
      this.initialFormValue,
      this.tariffProviderForm.getRawValue()
    );
  }

  reset(): void {
    this.mode = Mode.None;
    this.tariffProviderForm.reset();
    this.mainNavbarService.setIconState('save', true, true);
  }

  ngOnDestroy(): void {
    this.reset();
    this.providerService.resetData();
    this.providerService.resetDetailedData();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
