import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TariffGroup } from '../../../../../models/tariff/group/group';
import { Tablecolumn } from '../../../../../models/tablecolumn';
import { FilterOption } from '../../../../../shared/components/generic-table/generic-table.component';
import { Subject, takeUntil } from 'rxjs';
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
          state('partial', style({ width: '51%' })), // ca. 7 von 12 Spalten
          transition('full <=> partial', [animate('300ms ease-in-out')])
        ]),
      ]
})
export class TariffProviderSettingsComponent {

  isExpandable = false;
  providerEditOrNew = false;

  isTableLoading = false; // Neue Eigenschaft

  private initialFormValue: any;
  tariffProviderForm: FormGroup;
  selectedProvider: any = null; // TODO: Typisieren, z.B. TariffAttribute | null
  
  mode: Mode = Mode.None;
  tariffGroups: TariffGroup[] = [];
  inputTypes: any[] = [];

  providerColumns: Tablecolumn[] = this.getDefaultColumns();
  filters: FilterOption[] = [
    { type: 'text', key: 'search', label: 'Suche' },
    { type: 'select', key: 'tariff_group_id', label: 'Tarifgruppe', options: [] }
  ];

  mimeType: string = 'image/';
  logoProviderContent: SafeResourceUrl | null = null;

  @ViewChild('deleteTariffAttributTitleTemplate') deleteTariffAttributTitleTemplate!: TemplateRef<any>;
  @ViewChild('deleteTariffAttributeMessageTemplate') deleteTariffAttributeMessageTemplate!: TemplateRef<any>;
  @ViewChild('errorWhileDeletingTemplate') errorWhileDeletingTemplate!: TemplateRef<any>;

  private unsubscribe$ = new Subject<void>();


  constructor(
    //public tariffAttributeService: AttributeService,
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
    this.tariffProviderForm = this.formService.createTariffProviderFormGroup();
    this.initializeNavbar();
  }

  ngOnInit() {
    this.fetchInitialData();
    this.setupSubscriptions();
    this.mainNavbarService.setIconState('new', true, false);
    // this.watchFormChanges();

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
  }

  get tariffGroupsArray(): FormArray {
    return this.tariffProviderForm.get('tariff_groups') as FormArray;
  }

  private initializeNavbar(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, true);
    this.mainNavbarService.setIconState('back', false, true);
    this.mainNavbarService.setIconState('edit', true, true);
    this.mainNavbarService.setIconState('delete', true, true);
  }

  private fetchInitialData(): void {
    this.providerService.fetchData();
    //this.attributeTypService.fetchData();
  }

  private setupSubscriptions(): void {
    this.subscribeToTariffGroups();
    // this.subscribeToAttributeTypes();
    this.subscribeToNavbarActions();
    // this.subscribeToServiceResponse();
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

  private updateTariffGroupsFormArray(): void {
    this.tariffGroupsArray.clear();
    this.tariffGroups.forEach(group => {
      console.log(group)
      this.tariffGroupsArray.push(this.fb.group({
        id: [group.id],
        name: [group.name],
        icon: [group.icon],
        color: [group.color],
        checked: [false]
      }));
    });
    console.log(this.tariffGroupsArray)
  }

  private subscribeToNavbarActions(): void {
    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(button => this.handleIconClick(button));

    this.mainNavbarService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => action.proceedCallback());
  }

  private handleIconClick(button: string): void {
    console.log(button)
    switch (button) {
      case 'new':
        this.startNewAttribute();
        break;
      case 'edit':
        //this.editAttribute();
        break;
      case 'save':
        //this.saveAttribute();
        break;
      case 'delete':
        
        //this.showNotification(() => this.deleteAttribut(this.selectedAttribute?.id))
        break;
      // case 'delete': Implementierung fehlt noch
    }
  }

  startNewAttribute(): void {
    this.mode = Mode.New;
    this.providerEditOrNew = true;
    //this.providerColumnsColumns = this.getEditColumns();
    this.resetForm(); // Setzt das Formular zurück, inkl. detailsArray.clear()
    //this.subscribeToInputTypeChanges();
    this.editMode();

    //this.watchFormChanges();
  }

  editMode(): void {
    this.mainNavbarService.setIconState('new', true, true);
    this.mainNavbarService.setIconState('edit', true, true);
    this.mainNavbarService.setIconState('delete', true, true);
    this.mainNavbarService.setIconState('save', true, true);
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

  selectedRow(event: any): void {
      this.selectedProvider = event;
      this.mainNavbarService.setIconState('edit', true, false);
      this.mainNavbarService.setIconState('delete', true, false);
    }
  
  
  
    isRequired(control: AbstractControl | null): boolean {
      // Prüft ob ein Feld erforderlich ist
      return !!control?.validator?.({} as AbstractControl)?.['required'];
    }
  
  
  
    sort(event: any): void {
      // console.log(event)
      // this.tariffAttributeService.fetchData(event)
      // Sortierlogik implementieren
    }
  
    filter(event: any): void {
      // console.log(event)
      // this.tariffAttributeService.fetchData(event)
      // Filterlogik implementieren
    }

    closeDialog(){

    }

    closeGroup(): void {
      this.mode = Mode.None;
      this.providerEditOrNew = false;
      this.providerColumns = this.getDefaultColumns();
      this.resetForm();
      this.resetEditMode();
    }

    private resetForm(): void {
      this.tariffProviderForm.reset({
        id: null,
        name: '',
        logo_id: null,
      });
      this.updateTariffGroupsFormArray();
      // this.detailsArray.clear();
    }

    private resetEditMode(): void {
      this.mainNavbarService.setIconState('new', true, false);
      if (this.selectedProvider) {
        this.mainNavbarService.setIconState('edit', true, false);
        this.mainNavbarService.setIconState('delete', true, false);
      }
      this.mainNavbarService.setIconState('save', true, true);
    }


    openModal(event: Event) {
      event.preventDefault();
      (event.target as HTMLElement).blur();
  
      const modalRef = this.modalService.open(
        FileManagerModalComponent, { 
          windowClass: 'file-manager-modal',
          backdropClass: 'file-manager-modal-backdrop',
          size: 'lg' 
        }
      );

      modalRef.componentInstance.mimeType = this.mimeType;
      modalRef.componentInstance.fileSelected
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((selectedFile: FileData) => {
          this.handleFileSelected(selectedFile);
        });
    }

    handleFileSelected(file: FileData) {
      // Handle the selected file here

      this.tariffProviderForm?.patchValue({
        logo_id: file.id,
        file_name: file.name
      })
      this.getLogoProvider(file.id)
      console.log(this.tariffProviderForm)
    }

    getLogoProvider(id:number){
      this.productDocumentService.getFileContentById(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(content => {
          const url = window.URL.createObjectURL(content);
          this.logoProviderContent = this.sanitizer.bypassSecurityTrustResourceUrl(url+'#view=FitH');
        });
    }
}
