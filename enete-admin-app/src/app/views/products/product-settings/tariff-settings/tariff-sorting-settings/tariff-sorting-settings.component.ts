import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterOption } from '../../../../../shared/components/generic-table/generic-table.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Sorting } from '../../../../../models/tariff/sorting/sorting';
import { TariffGroup } from '../../../../../models/tariff/group/group';
import { Tablecolumn } from '../../../../../models/tablecolumn';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SortingService } from '../../../../../services/product/tariff/sorting/sorting.service';
import { MainNavbarService } from '../../../../../services/main-navbar.service';
import { NotificationService } from '../../../../../services/notification.service';
import { FormService } from '../../../../../services/form.service';
import { TariffGroupService } from '../../../../../services/product/tariff/tariff-group.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreloaderService } from '../../../../../services/preloader.service';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObjectDiffService } from '../../../../../services/object-diff.service';

interface SortingCriteriasForm {
  id: FormControl<number | null>;
  name: FormControl<string>;
  description: FormControl<string>;
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
  selector: 'app-tariff-sorting-settings',
  templateUrl: './tariff-sorting-settings.component.html',
  styleUrl: './tariff-sorting-settings.component.scss',
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
export class TariffSortingSettingsComponent {
    isExpandable = false;
    sortingEditOrNew = false;
    private initialFormValue: any;
    sortingForm: FormGroup<SortingCriteriasForm>;
    selectedSorting: Sorting | null = null;
    mode: Mode = Mode.None;
    tariffGroups: TariffGroup[] = [];
    sortingColumns: Tablecolumn[] = this.getDefaultColumns();
    filters: FilterOption[] = DEFAULT_FILTERS;
    
  
     @ViewChild('deleteSortingTitleTemplate') deleteSortingTitleTemplate!: TemplateRef<any>;
     @ViewChild('deleteSortingMessageTemplate') deleteSortingMessageTemplate!: TemplateRef<any>;
     @ViewChild('errorWhileDeletingTemplate') errorWhileDeletingTemplate!: TemplateRef<any>;
  
    private unsubscribe$ = new Subject<void>();
  

    constructor(
      public sortingService: SortingService,
      private mainNavbarService: MainNavbarService,
      private notificationService: NotificationService,
      private formService: FormService,
      public tariffGroupService: TariffGroupService,
      private snackBar: MatSnackBar,
      private preloaderService: PreloaderService,
      private fb: FormBuilder,
      private dialog: MatDialog,
      private objectDiffService: ObjectDiffService,
      // private modalService: NgbModal,
      // private sanitizer: DomSanitizer,
      //private productDocumentService: ProductDocumentService,
    ) {
      this.sortingForm = this.formService.createTariffSortingCriteriaFormGroup() as FormGroup<SortingCriteriasForm>;
      this.initializeNavbar();
      //this.setupDynamicValidators();
    }
    
      ngOnInit(): void {
        this.fetchInitialData();
        this.setupSubscriptions();
        this.watchFormChanges();
      }
    
      get tariffGroupsArray(): FormArray<FormGroup> {
        return this.sortingForm.get('tariff_groups') as FormArray<FormGroup>;
      }
    
      private initializeNavbar(): void {
        this.mainNavbarService.setIconState('save', true, true);
        this.mainNavbarService.setIconState('new', true, false);
        this.mainNavbarService.setIconState('back', false, true);
        this.mainNavbarService.setIconState('edit', true, true);
        this.mainNavbarService.setIconState('delete', true, true);
      }
    
      private fetchInitialData(): void {
          this.sortingService.fetchData();
        }
      
        private setupSubscriptions(): void {
          this.subscribeToTariffGroups();
          this.subscribeToNavbarActions();
          this.subscribeToServiceResponse();
          this.subscribeToSortingEvents();
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
          this.sortingService.detailedData$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(response => {
              if (!response || response.entityType !== 'tariffSorting') return;
              this.handleServiceResponse(response);
            });
        }
      
        private subscribeToSortingEvents(): void {
          this.sortingService.confirmAction$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(action => action.proceedCallback());
      
          this.sortingService.deleteSuccess$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              setTimeout(() => {
                this.preloaderService.hide();
                this.reset();
                this.selectedSorting = null;
                this.showSnackbar('Die Sortirung wurde erfolgreich gelöscht.', 'success-snackbar');
              }, 1000);
            });
      
          this.sortingService.errors$
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
          this.sortingService.fetchData();
          setTimeout(() => {
            this.preloaderService.hide();
            this.selectedSorting = null;
            this.resetEditMode();
            this.showSnackbar('Sortirung wurde erfolgreich gespeichert!', 'success-snackbar');
          }, 1000);
        }
      
        private handlePatchSuccess(data: Sorting): void {
          this.selectedSorting = data;
          setTimeout(() => {
            this.preloaderService.hide();
            this.resetEditMode();
            this.showSnackbar('Sortirung wurde erfolgreich geändert!', 'success-snackbar');
          }, 1000);
        }
      
        private handleServiceError(error: Error): void {
          this.preloaderService.hide();
          switch (error.requestType) {
            case 'post':
            case 'patch':
              this.showSnackbar('Speichern des Sortirung fehlgeschlagen', 'error-snackbar');
              break;
            case 'delete':
              this.showErrorDialog(error.errors);
              break;
          }
        }
      
        private handleIconClick(button: string): void {
          switch (button) {
            case 'new':
              this.startNewSorting();
              break;
            case 'edit':
              this.editSorting();
              break;
            case 'save':
              this.saveSorting();
              break;
            case 'delete':
              if (this.selectedSorting?.id) {
                this.showNotification(() => this.deleteSorting(this.selectedSorting!.id));
              }
              break;
          }
        }
      
        startNewSorting(): void {
          this.mode = Mode.New;
          this.sortingEditOrNew = true;
          this.sortingColumns = this.getEditColumns();
          this.resetForm();
          this.editMode();
        }
      
        editSorting(): void {
          if (!this.selectedSorting) return;
      
          this.sortingColumns = this.getEditColumns();
          this.sortingEditOrNew = true;
      
      
          this.sortingForm.patchValue({
            id: this.selectedSorting.id,
            name: this.selectedSorting.name || '',
            description: this.selectedSorting.description || ''
          });
      
          this.updateTariffGroupsFormArrayWithSelected(this.selectedSorting.tariff_group_ids ?? []);
          this.initialFormValue = structuredClone(this.sortingForm.getRawValue());
          this.mode = Mode.Edit;
          this.editMode();
        }
      
        saveSorting(): void {
          if (!this.sortingForm.valid) return;
      
          const formValue = this.sortingForm.getRawValue();
          this.preloaderService.show(this.mode === Mode.New ? 'Creating' : 'Updating');
      
          if (this.mode === Mode.New) {
            this.sortingService.addItem(formValue);
          } else if (this.mode === Mode.Edit) {
            const changes = this.objectDiffService.getDifferences(this.initialFormValue, formValue);
            this.sortingService.updateItem(formValue.id!, changes);
          }
      
          this.closeGroup();
        }
      
        deleteSorting(id: number): void {
          this.sortingService.deleteItem(id);
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
            { key: 'description', title: 'Beschreibung', sortable: true },
            { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
            { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true }
          ];
        }
      
        private getEditColumns(): Tablecolumn[] {
          return [
            { key: 'id', title: '#', sortable: false },
            { key: 'name', title: 'Name', sortable: false },
            { key: 'description', title: 'Beschreibung', sortable: false },
            // { key: 'created_at', title: 'Erstellt am', sortable: true, isDate: true },
            // { key: 'updated_at', title: 'Geändert am', sortable: true, isDate: true }
          ];
        }
      
        selectedRow(event: Sorting): void {
          this.selectedSorting = event;
          this.mainNavbarService.setIconState('edit', true, false);
          this.mainNavbarService.setIconState('delete', true, false);
        }
      
        isRequired(control: AbstractControl | null): boolean {
          return !!control?.validator?.({} as AbstractControl)?.['required'];
        }
      
        sort(event: any): void {
          if (!this.sortingEditOrNew) {
            this.sortingService.fetchData(event);
          }
        }
      
        filter(event: any): void {
          if (!this.sortingEditOrNew) {
            this.sortingService.fetchData(event);
          }
        }
      
        closeDialog(): void {
          this.dialog.closeAll();
        }
      
        closeGroup(): void {
          this.mode = Mode.None;
          this.sortingEditOrNew = false;
          this.sortingColumns = this.getDefaultColumns();
          this.resetForm();
          this.resetEditMode();
        }
        
        private resetForm(): void {
          this.sortingForm.reset({
            id: null,
            name: '',
            description: '',
          });
          this.updateTariffGroupsFormArray();
        }
      
        private resetEditMode(): void {
          this.mainNavbarService.setIconState('new', true, false);
          if (this.selectedSorting) {
            this.mainNavbarService.setIconState('edit', true, false);
            this.mainNavbarService.setIconState('delete', true, false);
          }
          this.mainNavbarService.setIconState('save', true, true);
        }
      
        // openModal(event: Event): void {
        //   event.preventDefault();
        //   (event.target as HTMLElement).blur();
      
        //   const modalRef = this.modalService.open(FileManagerModalComponent, {
        //     windowClass: 'file-manager-modal',
        //     backdropClass: 'file-manager-modal-backdrop',
        //     size: 'lg'
        //   });
      
        //   modalRef.componentInstance.mimeType = this.mimeType;
        //   modalRef.componentInstance.fileSelected
        //     .pipe(takeUntil(this.unsubscribe$))
        //     .subscribe((selectedFile: FileData) => this.handleFileSelected(selectedFile));
        // }
      
        private showNotification(proceedCallback: () => void): void {
          this.notificationService.configureNotification(
            null,
            null,
            this.deleteSortingTitleTemplate,
            this.deleteSortingMessageTemplate,
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
      
        // handleFileSelected(file: FileData): void {
        //   this.networkOperatorForm.patchValue({
        //     logo_id: file.id,
        //     file_name: file.name
        //   });
        //   this.getLogoNetworkOperator(file.id);
        // }
      
        // getLogoNetworkOperator(id: number): void {
        //   this.productDocumentService.getFileContentById(id)
        //     .pipe(
        //       takeUntil(this.unsubscribe$),
        //       catchError(err => {
        //         this.showSnackbar('Fehler beim Laden des Logos', 'error-snackbar');
        //         return of(null);
        //       })
        //     )
        //     .subscribe(content => {
        //       if (!content) return;
        //       const url = window.URL.createObjectURL(content);
        //       this.logoNetworkOperatorContent = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#view=FitH');
        //     });
        // }
      
        private watchFormChanges(): void {
          this.sortingForm.valueChanges
            .pipe(
              debounceTime(300),
              takeUntil(this.unsubscribe$)
            )
            .subscribe(() => {
              if (!this.sortingForm.valid) return;
              this.mainNavbarService.setIconState('save', true, this.mode !== Mode.New && !this.hasFormChanges());
            });
        }
      
        private hasFormChanges(): boolean {
          return this.mode === Mode.Edit && this.objectDiffService.hasDifferences(
            this.initialFormValue,
            this.sortingForm.getRawValue()
          );
        }
      
        reset(): void {
          this.mode = Mode.None;
          this.sortingForm.reset();
          this.mainNavbarService.setIconState('save', true, true);
        }
      
        ngOnDestroy(): void {
          this.reset();
          this.sortingService.resetData();
          this.sortingService.resetDetailedData();
          this.unsubscribe$.next();
          this.unsubscribe$.complete();
        }
}
