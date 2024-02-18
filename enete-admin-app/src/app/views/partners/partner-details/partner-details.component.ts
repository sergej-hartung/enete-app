import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PartnerService } from '../../../services/partner/partner.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { MainNavbarService } from '../../../services/main-navbar.service';
import {dateValidator } from '../../../shared/validators/date-validator'
import {booleanValidator } from '../../../shared/validators/boolean-validator'
import {matchPasswordValidator } from '../../../shared/validators/password-validator' 
import { StatusService } from '../../../services/partner/status/status.service';
import { CategorieService } from '../../../services/partner/categorie/categorie.service';
import { Status } from '../../../models/partner/status/status';
import { Categorie } from '../../../models/partner/categorie/categorie';
import { CareerService } from '../../../services/partner/career/career.service';
import { Career } from '../../../models/partner/career/career';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

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
  //@Input() userProfileAddressesForm!: FormGroup;

  userProfilesForm: FormGroup 
  requiredStatus: RequiredStatus = {};
  statuses: Status[] = []
  categories: Categorie[] = []
  careers: Career[] = []

  

  // user = [
  //   {
  //     login_name: "49000100",
  //     password: '',
  //     role_id: '1',
  //     avatar: 'assets/img/avatar-muster.jpg',
  //     status_id: '1'
  //   }
  // ]

  constructor(
    public partnerService: PartnerService,
    private statusService: StatusService,
    private careerService: CareerService,
    private categorieService: CategorieService,
    private mainNavbarService: MainNavbarService
  ){
    this.userProfilesForm = this.initUserProfilesForm();
  }

  ngOnInit() {
    
    this.setRequiredStatus();

    this.statusService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if(data){                       
          if(data.requestType == "get" && data.entityType == 'statuses'){
            this.statuses = data.data
          }
        }
      })

    this.categorieService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        // console.log(data)
        if(data){                       
          if(data.requestType == "get" && data.entityType == 'categories'){
            this.categories = data.data
          }
        }
      })

      this.careerService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        // console.log(data)
        if(data){                       
          if(data.requestType == "get" && data.entityType == 'careers'){
            this.careers = data.data
          }
        }
      })

    // get success created or updated
    // this.partnerService.success$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(message => {
    //     // if(message == 'created'){
    //     //   this.partnerService.setFormDirty(false)
    //     //   this.mainNavbarService.setIconState('save', true, true)
    //     //   this.userProfilesForm.reset()
    //     //   this.dataLoadedOrNew = false
    //     //   this.active = 1
    //     //   this.partnerService.fetchData()
    //     // }
    //     console.log(message); // или отобразите это сообщение в интерфейсе
    // });

    // get Errors
    this.partnerService.errors$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(errors => {
      console.log(errors)
      this.mainNavbarService.setIconState('save', true, true)
   
      if (errors?.vp_nr?.includes("The vp nr has already been taken.")) {
        this.userProfilesForm.controls['vp_nr'].setErrors({ vpNrExists: true });
      }
      if (errors?.egon_nr?.includes("The egon nr has already been taken.")) {
        this.userProfilesForm.controls['egon_nr'].setErrors({ egonNrExists: true });
        console.log(this.userProfilesForm)
      }

      if (errors?.email?.includes("The email has already been taken.")) {
        this.userProfilesForm.controls['email'].setErrors({ emailExists: true });
      }
    });

    // get Partner und ptch in Form
    if(this.partnerService){
      this.partnerService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => { 
          // console.log(data)
          if(data){                       
            if(data.requestType == "get" && data.entityType == 'partner'){
              console.log('get')
              console.log(data)
              this.resetUserProfilesForm()
              this.patchValueProfilesForm(data, false)
              //this.addNewAccess()
              //this.userProfilesForm.patchValue(data.data)
              this.dataLoadedOrNew = true
            }
            if(data.requestType == "post" && data.entityType == 'partner'){
              console.log('post')
              console.log(data)

              this.resetUserProfilesForm()
              this.dataLoadedOrNew = false
              this.active = 1
              this.partnerService.fetchData()
            }
            if(data.requestType == "patch" && data.entityType == 'partner'){
              console.log('patch')
              console.log(data)     

              this.resetUserProfilesForm()
              this.patchValueProfilesForm(data, false)
              //this.userProfilesForm.patchValue(data.data)
              this.dataLoadedOrNew = true

            }
          } else if(data == null ){
            this.partnerService.setFormDirty(false)
            this.mainNavbarService.setIconState('save', true, true)
            this.userProfilesForm.reset()
            this.dataLoadedOrNew = false
          }      
 
        });
    }

    // check Dirty and valid Form and set Save btn activ
    this.userProfilesForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(debounceTime(500))
      .subscribe(values => {
        console.log(values)
        console.log(this.userProfilesForm)
        if(this.userProfilesForm.dirty) { //   
          console.log('dirty')
          this.partnerService.setFormDirty(this.userProfilesForm.dirty);
          if(this.userProfilesForm.valid){
            this.mainNavbarService.setIconState('save', true, false);
          }else{
            this.mainNavbarService.setIconState('save', true, true);
          }                   
        }
      })

    // click btns  
    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(iconName => {
        if (iconName === 'new') {
            this.active = 1
            this.setDataNewUserProfile()           
            this.dataLoadedOrNew = true          
            console.log('new')
          // Обработка нажатия на иконку new
        }
        // if(iconName === 'new' && this.active === 2){
        //   this.userLoadOrNew = true  
        // }

        if (iconName === 'save') {
          console.log('submit Save')
          this.submitForm()
        }
      });

      //console.log(this.users)
  }


  addNewAccess(newUser: boolean = false){
    console.log(newUser)
    if(!this.users){
      this.userProfilesForm.addControl("users", new FormArray([this.createUserFormGroup(newUser)]))
    }else{
      if(this.users){
        this.users.push(this.createUserFormGroup(newUser))
      }
      console.log(this.userProfilesForm)
    }
    this.setRequiredStatus();
    //this.selectedUser = this.getLastUser()
  }

  submitForm() {
    const formData = new FormData();

    // Обработка обычных полей формы
    Object.keys(this.getDirtyValues(this.userProfilesForm)).forEach(key => {
      if (key !== 'users' && key !== 'contacts' && key !== 'addresses' && key !== 'banks') {
        formData.append(key, this.userProfilesForm.value[key]);
      }
    });
  
    // Обработка массива users
    this.getDirtyValues(this.userProfilesForm)['users']?.forEach((user:any, index:any) => {
      // console.log(this.getDirtyValues(this.userProfilesForm))
      // console.log(index)
      // console.log(user)
      Object.keys(user).forEach(field => {
        const value = user[field];
        if (value instanceof File) {
          formData.append(`users[${index}][${field}]`, value, value.name);
        } else {

          formData.append(`users[${index}][${field}]`, value);
        }
        // console.log(value)
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
    console.log(this.userProfilesForm.get('id')?.value)

    if(this.userProfilesForm.get('id')?.value){
      this.partnerService.updateItem(this.userProfilesForm.get('id')?.value, formData)
    }else{
      this.partnerService.addItem(formData)
    }
  }



  setDataNewUserProfile(){
    this.partnerService.resetDetailedData()
    this.resetUserProfilesForm()

    this.userProfilesForm.patchValue({
      'salutation': '',
      'title': 'kein Titel',
      'id_card':  false,        
      'business_registration': false,
      'sales_tax_liability': false,
      'vat_liability_proven': false,
      'billing_blocked': false,
      'payout_blocked': false,
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

    // this.userProfilesForm.valid
    
  }

  get users(){
    return this.userProfilesForm.get('users') as FormArray;
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
  

  

  private createContactFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(),
      prefix: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      number: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      user_profile_contact_type_id: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      user_profile_contact_category_id: new FormControl('', [Validators.pattern('^[0-9]+$')])
    });
  }
  
  private createAddressFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(),
      zip: new FormControl('', [Validators.pattern('^[0-9]{5}$')]),
      city: new FormControl('', [Validators.minLength(2)]),
      street: new FormControl('', [Validators.minLength(2)]),
      house_number: new FormControl('', [Validators.pattern('^[0-9a-zA-ZäöüßÄÖÜ\\-\\/\\. ]+$')]),
      user_profile_address_category_id: new FormControl('', [Validators.pattern('^[0-9]+$')])
    });
  }

  private createBankFormGroup(): FormGroup{
    return new FormGroup({
      id: new FormControl(),
      salutation: new FormControl(''),
      first_name: new FormControl('',[Validators.minLength(2)]),
      last_name: new FormControl('',[Validators.minLength(2)]),
      zip: new FormControl(['',Validators.pattern('^[0-9]{5}$')]),
      city: new FormControl(['',Validators.minLength(2)]),
      street: new FormControl('',[Validators.minLength(2)]),
      house_number: new FormControl('',[Validators.pattern('^[0-9a-zA-ZäöüßÄÖÜ\\-\\/\\. ]+$')]),
      country: new FormControl('',[Validators.minLength(2)]),
      bic: new FormControl(''),
      iban: new FormControl('',[Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Za-z0-9]{1,30}$')]),
      bank_name: new FormControl('',[Validators.minLength(2)]),
      user_profile_bank_categorie_id: new FormControl('', [Validators.pattern('^[0-9]+$')])
    })
  }

  private initUserProfilesForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(),
      vp_nr: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]), 
      egon_nr: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]), 
      company: new FormControl('', [Validators.minLength(2)]),                           
      salutation: new FormControl('', [Validators.required]),                            
      title: new FormControl(''),                                                        
      first_name: new FormControl('',[Validators.required, Validators.minLength(2)]),   
      last_name: new FormControl('',[Validators.required, Validators.minLength(2)]),     
      birthdate: new FormControl('',[dateValidator()]),                                  
      email: new FormControl('',[Validators.required, Validators.email]),                
      id_card: new FormControl(false,[booleanValidator()]),                                    
      business_registration: new FormControl(false,[booleanValidator()]),                      
      sales_tax_liability: new FormControl(false,[booleanValidator()]),                        
      vat_liability_proven: new FormControl(false,[booleanValidator()]),                       
      tax_number: new FormControl('',[Validators.pattern('^\\d{10,12}$|^\\d{1,5}/\\d{1,5}$|^\\d{1,5}/\\d{3,5}/\\d{1,5}$|^\\d{13}$')]), 
      tax_id: new FormControl('',[Validators.pattern('^[a-zA-Z0-9]+$')]),                
      tax_office: new FormControl('',[Validators.minLength(2)]),                         
      datev_no: new FormControl('',[Validators.pattern('^[a-zA-Z0-9]+$')]),              
      entrance: new FormControl('',[dateValidator()]),                                   
      entry: new FormControl('',[dateValidator()]),                                      
      exit: new FormControl('',[dateValidator()]),                                       
      billing_blocked: new FormControl(false,[booleanValidator()]),                            
      payout_blocked: new FormControl(false,[booleanValidator()]),                             
      internal_note: new FormControl('',[Validators.maxLength(500)]),                        
      external_note: new FormControl('',[Validators.maxLength(500)]),                        
      status_id: new FormControl('',[Validators.required, Validators.pattern('^[0-9]+$')]),  
      career_id: new FormControl('',[Validators.required, Validators.pattern('^[0-9]+$')]),  
      user_profile_categorie_id: new FormControl('',[Validators.pattern('^[0-9]+$')]),       
      parent : new FormControl('',[Validators.pattern('^[0-9]+$')]),                         


      contacts: new FormArray([this.createContactFormGroup(), this.createContactFormGroup()]),
      addresses: new FormArray([this.createAddressFormGroup()]),
      banks: new FormArray([this.createBankFormGroup()]),
      

    });
  }

  private createUserFormGroup(newUser: boolean = false): FormGroup {
    return new FormGroup({
      id: new FormControl(),
      login_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', newUser ? [Validators.required, Validators.minLength(6)] : [Validators.minLength(6)]),
      password_confirmation: new FormControl('', newUser ? [Validators.required, Validators.minLength(6)] : [Validators.minLength(6)]),
      role_id: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      avatar: new FormControl(null),
      last_visit: new FormControl(''),
      status_id: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    }, { validators: matchPasswordValidator });
  }

  private setRequiredStatus() {
    this.setControlRequiredStatus(this.userProfilesForm);
  
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

    console.log(statuses)
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
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
