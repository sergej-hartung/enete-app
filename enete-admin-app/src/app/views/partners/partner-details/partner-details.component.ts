import { Component} from '@angular/core';
import { AbstractControl, FormArray, FormGroup,} from '@angular/forms';
import { PartnerService } from '../../../services/partner/partner.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { MainNavbarService } from '../../../services/main-navbar.service';
import { StatusService } from '../../../services/partner/status/status.service';
import { CategorieService } from '../../../services/partner/categorie/categorie.service';
import { Status } from '../../../models/partner/status/status';
import { Categorie } from '../../../models/partner/categorie/categorie';
import { CareerService } from '../../../services/partner/career/career.service';
import { Career } from '../../../models/partner/career/career';
import { FormService } from '../../../services/form.service';



class RequiredStatus {
  [key: string]: boolean;
}

@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.component.html',
  styleUrl: './partner-details.component.scss'
})
export class PartnerDetailsComponent {
  active = 1;

  dataLoadedOrNew = false
  userLoadOrNew = false
  private unsubscribe$ = new Subject<void>();

  requiredStatus: RequiredStatus = {};
  statuses: Status[] = []
  categories: Categorie[] = []
  careers: Career[] = []

  userProfilesForm: FormGroup

  constructor(
    public partnerService: PartnerService,
    private statusService: StatusService,
    private careerService: CareerService,
    private categorieService: CategorieService,
    private mainNavbarService: MainNavbarService,
    private formService: FormService
  ){
    this.userProfilesForm = this.formService.initUserProfilesForm()
  }

  ngOnInit() {
    
    this.setRequiredStatus();
    this.loadData();
    this.handleFormChanges();
    this.handleNavbarActions();

    this.partnerService._data

  }

  private loadData() {
    this.loadStatuses()
    this.loadCategories()
    this.loadCareers()
    this.handlePartnerServiceErrors()
    this.handleDetailedData()
  }

  private loadStatuses(): void {
    this.statusService.data$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if(data && data.requestType == "get" && data.entityType == 'statuses'){
        this.statuses = data.data;
      }
    });
  }

  private loadCategories(): void {
    this.categorieService.data$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {         
      if(data && data.requestType == "get" && data.entityType == 'categories'){
        this.categories = data.data
      }
    })
  }

  private loadCareers(): void {
    this.careerService.data$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {            
      if(data && data.requestType == "get" && data.entityType == 'careers'){
        this.careers = data.data
      }
    })
  }

  private handlePartnerServiceErrors(): void {
    this.partnerService.errors$.pipe(takeUntil(this.unsubscribe$)).subscribe(errors => this.processErrors(errors));
  }

  private processErrors(errors: any): void {
    if (errors['employee_details.vp_nr']?.includes("The employee details.vp nr has already been taken.")) {
      this.userProfilesForm.get('employee_details.vp_nr')?.setErrors({ vpNrExists: true });
    }
    if (errors['employee_details.egon_nr']?.includes("The employee details.egon nr has already been taken.")) {
      this.userProfilesForm.get('employee_details.egon_nr')?.setErrors({ egonNrExists: true });
    }
  }

  private handleDetailedData(): void {
    this.partnerService.detailedData$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => this.processDetailedData(data));
  }

  private processDetailedData(data: any): void {
    console.log(data)
    if(data && data.requestType == "get" && data.entityType == 'partner'){
        
        
      this.resetUserProfilesForm()
      this.patchValueProfilesForm(data, false)
      this.dataLoadedOrNew = true
    }
    if(data && data.requestType == "post" && data.entityType == 'partner'){
        
        

      this.resetUserProfilesForm()
      this.dataLoadedOrNew = false
      this.active = 1
      this.partnerService.fetchData()
        
    }
    if(data && data.requestType == "patch" && data.entityType == 'partner'){
        
        

      this.resetUserProfilesForm()
      this.patchValueProfilesForm(data, false)
      this.dataLoadedOrNew = true

    }
    if(data == null ){
      this.partnerService.setFormDirty(false)
      this.mainNavbarService.setIconState('save', true, true)
      this.userProfilesForm.reset()
      this.dataLoadedOrNew = false
      this.active = 1
    }      
  }

  private handleFormChanges() {
    this.userProfilesForm.valueChanges.pipe(takeUntil(this.unsubscribe$), debounceTime(500)).subscribe(values => {
          
          
        if(this.userProfilesForm.dirty) { //   
            
          this.partnerService.setFormDirty(this.userProfilesForm.dirty);
          if(this.userProfilesForm.valid){
            this.mainNavbarService.setIconState('save', true, false);
          }else{
            this.mainNavbarService.setIconState('save', true, true);
          }                   
        }
      })
  }

  private handleNavbarActions() {
    this.mainNavbarService.iconClicks$.pipe(takeUntil(this.unsubscribe$)).subscribe(iconName => {
        if (iconName === 'new') {
            this.active = 1
            this.setDataNewUserProfile()           
            this.dataLoadedOrNew = true          
        }

        if (iconName === 'save') {
            
          this.submitForm()
        }
      });
  }

  addNewDocuments(files: File[]){
      
    let documentsChanged = false;
    Array.from(files).forEach(file => {
      this.formService.addDocuments(this.userProfilesForm, file)
      documentsChanged = true;
    });
  
    if (documentsChanged) {
      this.documents.markAsDirty();
    }
  }


  addNewAccess(newUser: boolean = false){
      

    this.formService.addAccess(this.userProfilesForm, newUser)
    this.setRequiredStatus();
  }

  submitForm() {
    const formData = this.prepareFormData(this.userProfilesForm);

    if(this.userProfilesForm.get('id')?.value){
      this.partnerService.updateItem(this.userProfilesForm.get('id')?.value, formData)
    }else{
      this.partnerService.addItem(formData)
    }
  }

  private prepareFormData(formGroup: FormGroup): FormData {
    const formData = new FormData();
      
    // Обработка обычных полей формы
    Object.keys(this.getDirtyValues(this.userProfilesForm)).forEach(key => {
      if (!['users', 'documents', 'contacts', 'addresses', 'banks', 'employee_details', 'parent'].includes(key)) {
        formData.append(key, this.userProfilesForm.value[key]);
      }

      if(['parent'].includes(key)){
        Object.keys(this.userProfilesForm.value[key]).forEach(k => {
          if(k === 'id' && this.userProfilesForm.value[key][k]){
              
            formData.append('parent_id', this.userProfilesForm.value[key][k]);
          }
        })
      }
    });

    // Обработка employee_details как вложенного FormGroup
    const employeeDetails = this.getDirtyValues(this.userProfilesForm.get('employee_details'));
    Object.keys(employeeDetails).forEach(key => {
      const value = employeeDetails[key];
      formData.append(`employee_details[${key}]`, value);
    });
  

    ['users', 'documents'].forEach(arrayName => {
      this.getDirtyValues(this.userProfilesForm)[arrayName]?.forEach((item: any, index:any) => {
        Object.keys(item).forEach(field => {
          const value = item[field];
          if (value instanceof File) {
            formData.append(`${arrayName}[${index}][${field}]`, value, value.name);
          } else {
            formData.append(`${arrayName}[${index}][${field}]`, value);
          }
        });
      });

    });

    
    // По аналогии обработка массивов contacts, addresses, banks
    ['contacts', 'addresses', 'banks'].forEach(arrayName => {
      this.getDirtyValues(this.userProfilesForm)[arrayName]?.forEach((item: any, index:any) => {
        Object.keys(item).forEach(field => {
          formData.append(`${arrayName}[${index}][${field}]`, item[field]);
        });
      });

    });

    return formData;
  }


  setDataNewUserProfile(){
    this.partnerService.resetDetailedData()
    this.resetUserProfilesForm()

    this.userProfilesForm.patchValue({
      'salutation': '',
      'title': 'kein Titel',
      'contacts': [
        {
          'user_profile_contact_type_id': '1',
          'user_profile_contact_category_id': '1'
        },
        {
          'user_profile_contact_type_id': '2',
          'user_profile_contact_category_id': '1'
        }
      ],
      'banks': [
        {
          'salutation': 'Herr',
          'country': 'Germany',
          'user_profile_bank_categorie_id': '1'
        }
      ],
      'addresses': [
        {
          'user_profile_address_category_id': '1',
        }
      ]
    })  
  }

  get users(){
    return this.userProfilesForm.get('users') as FormArray;
  }

  get documents(){
    return this.userProfilesForm.get('documents') as FormArray;
  }

  getDirtyValues(form: any) {
    let dirtyValues: any = form instanceof FormGroup ? {} : [];
    let isFormWithoutId = form.get('id')?.value == null; // Проверяем наличие id
    let hasChanges = false; // Флаг для отслеживания изменений
  
    Object.keys(form.controls).forEach(key => {
      let currentControl = form.controls[key];
  
      if (currentControl instanceof FormGroup || currentControl instanceof FormArray) {
        // Рекурсивный вызов для вложенных FormGroup/FormArray
        const nestedDirtyValues = this.getDirtyValues(currentControl);
        if (nestedDirtyValues !== null) {
          dirtyValues[key] = nestedDirtyValues;
          hasChanges = true; // Устанавливаем флаг, если есть изменения во вложенных элементах
        }
      } else {
        // Для форм без id включаем все заполненные поля
        if (isFormWithoutId && currentControl.value != null) {
          dirtyValues[key] = currentControl.value;
        }
        // Для форм с id включаем только измененные поля
        else if (!isFormWithoutId && currentControl.dirty) {
          dirtyValues[key] = currentControl.value;
          hasChanges = true; // Устанавливаем флаг, если поле было изменено
        }
      }
    });
  
    // Добавляем id, если он существует и были изменения
    if (!isFormWithoutId && form instanceof FormGroup && form.get('id')?.value != null && hasChanges) {
      dirtyValues['id'] = form.get('id')?.value;
    }
  
    return Object.keys(dirtyValues).length > 0 ? dirtyValues : [];
  }

  private setRequiredStatus() {
    this.setControlRequiredStatus(this.userProfilesForm);

    const employeeDetails = this.userProfilesForm.get('employee_details');
    if (employeeDetails instanceof FormGroup) {
        this.setControlRequiredStatus(employeeDetails, 'employee_details');
    }
  
    // Для FormArray
    ['contacts', 'addresses', 'banks', 'users'].forEach(arrayName => {
      const formArray = this.userProfilesForm.get(arrayName);
      if (formArray instanceof FormArray) {
        formArray.controls.forEach((group, index) => {
          if (group instanceof FormGroup) {
            this.setControlRequiredStatus(group, `${arrayName}[${index}]`);
          }
        });
      }
    });
  }

  private setControlRequiredStatus(group: FormGroup | FormArray, prefix: string = '') {
    Object.keys(group.controls).forEach(key => {
      const controlPath = prefix ? `${prefix}.${key}` : key;
      const control = group.get(key);
      this.requiredStatus[controlPath] = this.hasRequiredValidator(control);
    });
  }

  private hasRequiredValidator(control: AbstractControl | null): boolean {
    if (!control) return false;
    const validator = control.validator ? control.validator({} as AbstractControl) : null;
    return validator && validator["required"];
  }

  private patchValueProfilesForm(data: any, newUser: boolean = false){    
    if(data['data']['users']){
      if(Array.isArray(data['data']['users']) && data['data']['users'].length > 0){
        data['data']['users'].forEach(user => {
          this.addNewAccess(newUser)
        })
      }
    } 
    if(data['data']['documents']){
      if(Array.isArray(data['data']['documents']) && data['data']['documents'].length > 0){
        data['data']['documents'].forEach(document => {
          this.formService.addDocuments(this.userProfilesForm, document)
        })
      } 
    }
    this.userProfilesForm.patchValue(data.data)
    this.checkBlockedStatusUserProfiles()
  }

  private checkBlockedStatusUserProfiles(){
    const users = this.users
    const statuses = this.statuses
    let status

    if(statuses.find(value => value.name === 'Gesperrt')){
      status = statuses.find(value => value.name === 'Gesperrt')
    }else if(statuses.find(value => value.name === 'Gekündigt')){
      status = statuses.find(value => value.name === 'Gekündigt')
    }

    if(users && status){
      users.controls.forEach(control => {
        let status = statuses.find(value => value.id == this.userProfilesForm.get('status_id')?.value)
        if(status && (status.name === 'Gesperrt' || status.name === 'Gekündigt')){
          control.get('status_id')?.disable()
        }else{
          control.get('status_id')?.enable()
        }
      })
    }

      
    if(this.userProfilesForm.get('status_id')?.value == 3 || this.userProfilesForm.get('status_id')?.value == 4){
      return true
    }else{
      return false
    }
  }

  private resetUserProfilesForm(){
    this.userProfilesForm.reset()
    this.partnerService.setFormDirty(false)
    this.mainNavbarService.setIconState('save', true, true)
    this.userProfilesForm.removeControl('users')
    this.userProfilesForm.removeControl('documents')
  }
  
  ngOnDestroy() {
      
    this.resetUserProfilesForm()
    this.dataLoadedOrNew = false
    this.userLoadOrNew = false
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    
  }
}
