import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
        external_id:         ['', [Validators.pattern('^[a-zA-Z0-9üÜöÖäÄß]+$')]],
        name:                ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9üÜöÖäÄß]+$')]],
        name_short:          ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9üÜöÖäÄß]+$')]],
        provider_id:         ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        network_operator_id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        group_id:            ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        status_id:           ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        is_published:        ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        note:                ['', [Validators.pattern('^[a-zA-Z0-9üÜöÖäÄß]+$')]],
        pdf_document_id:     ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      }),
      attribute_groups: this.fb.array([])
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
}