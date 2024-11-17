import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import {dateValidator } from '../shared/validators/date-validator';
import {booleanValidator } from '../shared/validators/boolean-validator'
import {matchPasswordValidator } from '../shared/validators/password-validator'

@Injectable({
  providedIn: 'root'
})
export class FormService {  

  tariffForm: any

  constructor(private fb: FormBuilder) {}

  public initUserProfilesForm(): FormGroup {
    return this.fb.group({
      id:            [],
      salutation:    ['', Validators.required],
      title:         [''],
      first_name:    ['', [Validators.required, Validators.minLength(2)]],
      last_name:     ['', [Validators.required, Validators.minLength(2)]],
      birthdate:     ['', [dateValidator()]],
      email:         ['', [Validators.required, Validators.email]],
      internal_note: ['', [Validators.maxLength(500)]],
      external_note: ['', [Validators.maxLength(500)]],
      parent:        [''],

      employee_details: this.initEmployeeDetailsFormGroup(),
      documents: this.fb.array([]),
      contacts: this.fb.array([this.createContactFormGroup(), this.createContactFormGroup()]),
      addresses: this.fb.array([this.createAddressFormGroup()]),
      banks: this.fb.array([this.createBankFormGroup()]),
    })
  }

  private initEmployeeDetailsFormGroup(): FormGroup {
    return this.fb.group({
      id:                    [],
      user_profile_id:       ['',[Validators.pattern('^[0-9]+$')]],
      vp_nr:                 ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      egon_nr:               ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      company:               ['', [Validators.minLength(2)]],
      id_card:               [false,[booleanValidator()]],
      business_registration: [false,[booleanValidator()]],
      sales_tax_liability:   [false,[booleanValidator()]],
      vat_liability_proven:  [false,[booleanValidator()]],
      tax_number:            ['',[Validators.pattern('^\\d{10,12}$|^\\d{1,5}/\\d{1,5}$|^\\d{1,5}/\\d{3,5}/\\d{1,5}$|^\\d{13}$')]],
      tax_id:                ['',[Validators.pattern('^[a-zA-Z0-9]+$')]],
      tax_office:            ['',[Validators.minLength(2)]],
      datev_no:              ['',[Validators.pattern('^[a-zA-Z0-9]+$')]],
      entrance:              ['',[dateValidator()]],
      entry:                 ['',[dateValidator()]],
      exit:                  ['',[dateValidator()]],
      billing_blocked:       [false,[booleanValidator()]],
      payout_blocked:        [false,[booleanValidator()]],
      status_id:             ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      career_id:             ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      categorie_id:          ['',[Validators.pattern('^[0-9]+$')]]
    })
  }

  private createContactFormGroup(): FormGroup {
    return this.fb.group({
      id:                               [],
      prefix:                           ['', [Validators.pattern('^[0-9]+$')]],
      number:                           ['', [Validators.pattern('^[0-9]+$')]],
      user_profile_contact_type_id:     ['', [Validators.pattern('^[0-9]+$')]],
      user_profile_contact_category_id: ['', [Validators.pattern('^[0-9]+$')]]
    })
  }

  private createAddressFormGroup(): FormGroup {
    return this.fb.group({
      id:                               [],
      zip:                              ['', [Validators.pattern('^[0-9]{5}$')]],
      city:                             ['', [Validators.minLength(2)]],
      street:                           ['', [Validators.minLength(2)]],
      house_number:                     ['', [Validators.pattern('^[0-9a-zA-ZäöüßÄÖÜ\\-\\/\\. ]+$')]],
      user_profile_address_category_id: ['', [Validators.pattern('^[0-9]+$')]]
    })
  }

  private createBankFormGroup(): FormGroup{
    return this.fb.group({
      id:                             [],
      salutation:                     [''],
      first_name:                     ['', [Validators.minLength(2)]],
      last_name:                      ['', [Validators.minLength(2)]],
      zip:                            ['', [Validators.pattern('^[0-9]{5}$')]],
      city:                           ['', [Validators.minLength(2)]],
      street:                         ['', [Validators.minLength(2)]],
      house_number:                   ['', [Validators.pattern('^[0-9a-zA-ZäöüßÄÖÜ\\-\\/\\. ]+$')]],
      country:                        ['', [Validators.minLength(2)]],
      bic:                            [''],
      iban:                           ['', [Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Za-z0-9]{1,30}$')]],
      bank_name:                      ['', [Validators.minLength(2)]],
      user_profile_bank_categorie_id: ['', [Validators.pattern('^[0-9]+$')]],
    })
  }

  private createDocumentsFormGroup(f: File | {name: string, size: string, type:string}){
    return this.fb.group({
      id:   [],
      name: [f['name'] ? f.name : ''],
      size: [f['size'] ? f.size : ''],
      type: [f['type'] ? f.type : ''],
      file: [f instanceof File ? f : null],
    })
  }

  private createUserFormGroup(newUser: boolean = false): FormGroup {
    return this.fb.group({
      id:                    [],
      login_name:            ['', [Validators.required, Validators.minLength(2)]],
      password:              ['', newUser ? [Validators.required, Validators.minLength(6)] : [Validators.minLength(6)]],
      password_confirmation: ['', newUser ? [Validators.required, Validators.minLength(6)] : [Validators.minLength(6)]],
      role_id:               ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      avatar:                [null],
      last_visit:            [''],
      status_id:             ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    }, { validators: matchPasswordValidator })
  }


  addDocuments(form:FormGroup, file: File){
    const documents = form.get('documents') as FormArray;
    if(documents){
      documents.push(this.createDocumentsFormGroup(file))
    }else{
      form.addControl('documents', this.fb.array([this.createDocumentsFormGroup(file)]))
    }
  }

  addAccess(form:FormGroup, newUser: boolean = false){
    const users = form.get('users') as FormArray;
    if(users){
      users.push(this.createUserFormGroup(newUser))
    }else{
      form.addControl("users", this.fb.array([this.createUserFormGroup(newUser)]))
    }
  }

  initArchiveDocuments(): FormGroup{
    return this.fb.group({
      documents: this.fb.array([]),
    })
  }

  public initTariffFormGroup(): FormGroup{
    return this.fb.group({
      tariff: this.fb.group({
        id:                  [],
        external_id:         ['', [Validators.pattern('^[a-zA-Z0-9 üÜöÖäÄß]+$')]],
        name:                ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 üÜöÖäÄß]+$')]],
        name_short:          ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 üÜöÖäÄß]+$')]],
        provider_id:         ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        network_operator_id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        group_id:            ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        status_id:           ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        is_published:        [false, [booleanValidator()]],
        note:                ['', [Validators.pattern('^[a-zA-Z0-9 üÜöÖäÄß]+$')]],
        file_id:             ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        file_name:           ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 üÜöÖäÄß.]+$')]],
        
      }),
      combo_status: this.fb.array([]), // New field
      categories: this.fb.array([]),
      attribute_groups: this.fb.array([]),
      calc_matrix: this.fb.array([]),
      promos: this.fb.array([]),
      tpl: this.createTplFormArray(),
      tariffdetails: this.fb.array([])
    })
  }

  createTplFormArray(){
    let tplArr = this.fb.array([]) as FormArray

    for (let i = 0; i < 8; i++){
      tplArr.push(this.createTplFormGroup(i+1))
    }
    
    return tplArr
  }

  createTplFormGroup(pos: number){
    return this.fb.group({
      id: [],
      customFild:       [false, [booleanValidator()]],
      isMatrix:         [false, [booleanValidator()]],
      autoFieldName:    [true, [booleanValidator()]],
      manualFieldName:  ['', [Validators.pattern('^[a-zA-Z0-9 üÜöÖäÄß]+$')]],
      autoValueSource: [true, [booleanValidator()]],
      isHtml:           [false, [booleanValidator()]],
      manualValueHtml:  [''],
      manualValue:     ['', [Validators.pattern('^[a-zA-Z0-9 üÜöÖäÄß]+$')]],
      autoUnit:         [true, [booleanValidator()]],
      manualUnit:       ['', [Validators.pattern('^[a-zA-Z0-9 üÜöÖäÄß]+$')]],
      showUnit:         [true, [booleanValidator()]],
      showValue:       [true, [booleanValidator()]],
      showFieldName:    [true, [booleanValidator()]],
      showIcon:         [true, [booleanValidator()]],
      position:         [pos, [Validators.pattern('^[0-9]+$')]],
      icon:             ['', [Validators.pattern('^[a-zA-Z0-9 üÜöÖäÄß]+$')]],
    })
  }


  getTariffForm(){
    if(this.tariffForm){
      return this.tariffForm as FormGroup
    }else{
      this.tariffForm = this.initTariffFormGroup()
      return this.tariffForm as FormGroup
    }
  }

  public resetTariffForm(): void {
    this.tariffForm = this.initTariffFormGroup(); // Создаем новую форму, чтобы сбросить все значения
  }

  public cloneTariffFormGroup(originalForm: FormGroup): FormGroup {
    // Создаем новую форму, используя initTariffFormGroup для получения структуры
    const clonedForm = this.initTariffFormGroup();
  
    // Рекурсивно копируем значения и состояния контролов
    this.copyFormGroupValues(originalForm, clonedForm);
  
    return clonedForm;
  }

  private copyFormGroupValues(original: FormGroup, clone: FormGroup): void {
    Object.keys(original.controls).forEach(key => {
      const originalControl = original.get(key);
      const cloneControl = clone.get(key);
  
      if (originalControl instanceof FormGroup && cloneControl instanceof FormGroup) {
        // Рекурсивно копируем вложенные FormGroup
        this.copyFormGroupValues(originalControl, cloneControl);
      } else if (originalControl instanceof FormArray && cloneControl instanceof FormArray) {
        // Копируем FormArray
        originalControl.controls.forEach((ctrl, index) => {
          const clonedCtrl = this.fb.control(ctrl.value, ctrl.validator || null, ctrl.asyncValidator || null);
          cloneControl.push(clonedCtrl);
        });
      } else {
        // Копируем значение и валидаторы
        cloneControl?.setValue(originalControl?.value);
        cloneControl?.setValidators(originalControl?.validator || null);
        cloneControl?.setAsyncValidators(originalControl?.asyncValidator || null);
        cloneControl?.updateValueAndValidity();
      }
    });
  }
  
}