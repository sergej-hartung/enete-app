import { Component } from '@angular/core';
import { combineLatest, forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ProviderService } from '../../../../../services/product/tariff/provider/provider.service';
import { NetworkOperatorService } from '../../../../../services/product/tariff/network-operator/network-operator.service';
import { StatusService } from '../../../../../services/product/tariff/status/status.service';
import { FormService } from '../../../../../services/form.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../../../../services/product/product.service';
import { CategoryService } from '../../../../../services/product/tariff/category/category.service';
import { Category } from '../../../../../models/tariff/category/category';
import { ComboStatusService } from '../../../../../services/product/tariff/combo-status/combo-status.service';
import { ComboStatus } from '../../../../../models/tariff/comboStatus/comboStatus';
import { TariffService } from '../../../../../services/product/tariff/tariff.service';
import { DataResponse } from '../../../../../models/data-interface';
import { Tariff, TariffDocument } from '../../../../../models/tariff/tariff';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileData, FileManagerModalComponent } from '../../../../../shared/components/file-manager-modal/file-manager-modal.component';

@Component({
  selector: 'app-tariff-details-a-e',
  templateUrl: './tariff-details-a-e.component.html',
  styleUrl: './tariff-details-a-e.component.scss'
})
export class TariffDetailsAEComponent {
  
  combiStatus: ComboStatus[] | [] = [
    // { id: 1, label: 'ohne Hardware', checked: false },
    // { id: 2, label: 'mit Hardware', checked: false },
  ];
  tariffCategories: Category[] | [] = [
    // { id: 1, label: 'Privat', checked: false },
    // { id: 2, label: 'Business', checked: false },
    // { id: 3, label: 'Jungeleute', checked: false },
    // { id: 4, label: 'VVL', checked: false },
  ];
  tariffForm: FormGroup
  tariffFormGroup: FormGroup
  tariffStatuses: any = []
  tariffProviders: any = []
  tariffNetworkOperators: any = []
  mimeType: string = 'application/pdf';

  private unsubscribe$ = new Subject<void>();

  constructor(
    private tariffStatusService: StatusService,
    private tariffProviderService: ProviderService,
    private tariffNetworkOperatorService: NetworkOperatorService,
    private categoryService: CategoryService,
    private comboStatusService: ComboStatusService,
    private productService: ProductService,
    public tariffService: TariffService,
    private formService: FormService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
    // this.tariffFormGroup = this.formService.initTariffFormGroup()
    this.tariffForm = this.formService.getTariffForm()
    this.tariffFormGroup = this.tariffForm.get('tariff') as FormGroup
  }

  ngOnInit() {
    this.categoryService.fetchData();
    this.comboStatusService.fetchData();

    combineLatest([
      this.comboStatusService.getDataLoadedObservable(), 
      this.categoryService.getDataLoadedObservable()
    ]).pipe(
      takeUntil(this.unsubscribe$),
    )
    .subscribe(res => {
      this.loadData()
    })
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
    const tariff = this.tariffForm.get('tariff')
    tariff?.patchValue({
      file_id: file.id,
      file_name: file.name
    })
  }

  loadData(){
    this.categoryService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(categoriesData => {
        this.productService.updateInitTariffDataLoaded('categories', true);
        this.tariffCategories = categoriesData?.data || [];
        this.setCategoriesFormArray();
      })

    this.comboStatusService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(comboStatusData => {
        this.productService.updateInitTariffDataLoaded('connectionStatuses', true);
        this.combiStatus = comboStatusData?.data || [];
        this.setComboStatusFormArray();
      })

    this.tariffStatusService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(statusesData => {
        this.tariffStatuses = statusesData?.data || [];
      })
    
    this.tariffProviderService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(providersData => {
        this.tariffProviders = providersData?.data || [];
      })

    this.tariffNetworkOperatorService.data$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(networkOperatorsData => {
        this.tariffNetworkOperators = networkOperatorsData?.data || [];
      })

    this.productService.productMode$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(mode => {
        if (mode === 'edit') {        
          this.loadTariff();
        } else if (mode === 'new'){
          this.setTariffGroup()
        } 
      })
  }

  isDataResponse(result: any): result is DataResponse<Tariff> {
    return result && typeof result === 'object' && 'entityType' in result;
  }

  setComboStatusFormArray() {
    const hardwareComboArray = this.tariffForm.get('combo_status') as FormArray;
    this.combiStatus.forEach(option => {
      if(hardwareComboArray){
        hardwareComboArray.push(this.fb.group({
          id: [option.id],
          name: [option.name],
          checked: [option.checked || false]
        }));
      }
    });
  }

  setCategoriesFormArray() {
    const categoriesArray = this.tariffForm.get('categories') as FormArray;

    this.tariffCategories.forEach(option => {
      if(categoriesArray){
        categoriesArray.push(this.fb.group({
          id: [option.id],
          name: [option.name],
          checked: [option.checked || false]
        }));
      }
    });
  }


  loadTariff() {
    this.tariffService.detailedData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(tariffData => {
        if(tariffData){
          this.tariffFormGroup.patchValue(tariffData.data);
          this.patchComboStatus(tariffData.data.combo_status);
          this.patchCategories(tariffData?.data?.tariff_categories);
          this.patchDocument(tariffData?.data?.document)

          let status = tariffData.data.status;
          let provider = tariffData.data.provider;
          let network_operator = tariffData.data.network_operator;

          this.tariffFormGroup.patchValue({
            status_id: status?.id,
            provider_id: provider?.id,
            network_operator_id: network_operator?.id
          });

          this.productService.updateTariffLoadedState('tariff', true);
        }   
      })
  }

  patchComboStatus(comboStatus: ComboStatus[] | undefined) {
    if(comboStatus && comboStatus.length > 0){
      const hardwareComboArray = this.tariffForm.get('combo_status') as FormArray;
      comboStatus.forEach(status => {
        const control = hardwareComboArray.controls.find(ctrl => ctrl.value.id === status.id);
        if (control) {
          control.patchValue({ checked: true });
        }
      });
    }
  }

  patchCategories(categories: Category[] | undefined) {
    if (categories && categories.length > 0) {
      const categoriesArray = this.tariffForm.get('categories') as FormArray;
      categories.forEach(category => {
        const control = categoriesArray.controls.find(ctrl => ctrl.value.id === category.id);
        if (control) {
          control.patchValue({ checked: true });
        }
      });
    }
  }

  patchDocument(document: TariffDocument | undefined){
    if(document){
      const tariff = this.tariffForm.get('tariff') as FormGroup
        if (tariff) {
          tariff.patchValue(
            { 
              file_id: document.id,
              file_name: document.original_name
             }
          );
        }
    }
  }

  setTariffGroup() {
    this.productService.tariffGroupId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(groupId => {
        if (groupId) {
          this.tariffFormGroup.get('group_id')?.setValue(groupId);
        }
      })
  }

  updateSelectedItems() {
    this.combiStatus = this.combiStatus.map(option => {
      option.checked = !!option.checked;
      return option;
    });
    this.tariffCategories = this.tariffCategories.map(option => {
      option.checked = !!option.checked;
      return option;
    });
  } 

  get comboStatus(): FormArray {
    return this.tariffForm.get('combo_status') as FormArray;
  }

  get categories(): FormArray {
    return this.tariffForm.get('categories') as FormArray;
  }

  get selectedCombiStatus() {
    return this.combiStatus.filter(option => option.checked);
  }

  get selectedTariffCategories() {
    return this.tariffCategories.filter(option => option.checked);
  }

  isRequired(control: AbstractControl | null): boolean {
    if (control && control.validator) {
      const validator = control.validator({} as AbstractControl);
      return validator && validator["required"];
    }
    return false;
  }

  test(){
    console.log(this.tariffForm)
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}



