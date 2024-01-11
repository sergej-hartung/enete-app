import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PartnerService } from '../../../services/partner.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { MainNavbarService } from '../../../services/main-navbar.service';
import {dateValidator } from '../../../shared/validators/date-validator'
import {booleanValidator } from '../../../shared/validators/boolean-validator'

@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.component.html',
  styleUrl: './partner-details.component.scss'
})
export class PartnerDetailsComponent {
  active = 1;

  dataLoadedOrNew = false
  private unsubscribe$ = new Subject<void>();
  //@Input() userProfileAddressesForm!: FormGroup;

  userProfilesForm = new FormGroup({
    id: new FormControl(),
    vp_nr: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]), //Erledigt
    company: new FormControl('', [Validators.minLength(2)]),                           //Erledigt
    salutation: new FormControl('', [Validators.required]),                            //Erledigt
    title: new FormControl(''),                                                        //Erledigt
    first_name: new FormControl('',[Validators.required, Validators.minLength(2)]),    //Erledigt
    last_name: new FormControl('',[Validators.required, Validators.minLength(2)]),     //Erledigt
    birthdate: new FormControl('',[dateValidator()]),                                  //Erledigt
    email: new FormControl('',[Validators.required, Validators.email]),                //Erledigt
    id_card: new FormControl(false,[booleanValidator()]),                                    //Erledigt
    business_registration: new FormControl(false,[booleanValidator()]),                      //Erledigt
    sales_tax_liability: new FormControl(false,[booleanValidator()]),                        //Erledigt
    vat_liability_proven: new FormControl(false,[booleanValidator()]),                       //Erledigt
    tax_number: new FormControl('',[Validators.pattern('^\\d{10,12}$|^\\d{1,5}/\\d{1,5}$|^\\d{1,5}/\\d{3,5}/\\d{1,5}$|^\\d{13}$')]), //Erledigt
    tax_id: new FormControl('',[Validators.pattern('^[a-zA-Z0-9]+$')]),                //Erledigt
    tax_office: new FormControl('',[Validators.minLength(2)]),                         //Erledigt
    datev_no: new FormControl('',[Validators.pattern('^[a-zA-Z0-9]+$')]),              //Erledigt
    entrance: new FormControl('',[dateValidator()]),                                   //Erledigt
    entry: new FormControl('',[dateValidator()]),                                      //Erledigt
    exit: new FormControl('',[dateValidator()]),                                       //Erledigt
    billing_blocked: new FormControl(false,[booleanValidator()]),                            //Erledigt
    payout_blocked: new FormControl(false,[booleanValidator()]),                             //Erledigt
    internal_note: new FormControl('',[Validators.maxLength(500)]),                        // nicht verfügbar
    external_note: new FormControl('',[Validators.maxLength(500)]),                        // nicht verfügbar
    status_id: new FormControl('',[Validators.required, Validators.pattern('^[0-9]+$')]),  //Erledigt
    career_id: new FormControl('',[Validators.required, Validators.pattern('^[0-9]+$')]),  //Erledigt
    user_profile_categorie_id: new FormControl('',[Validators.pattern('^[0-9]+$')]),       //Erledigt
    parent : new FormControl('',[Validators.pattern('^[0-9]+$')]),                         //Erledigt
    //last_visit: new FormControl('',),

    contacts: new FormArray([
      new FormGroup({
        id: new FormControl(),
        prefix: new FormControl('',[Validators.pattern('^[0-9]+$')]),
        number: new FormControl('',[Validators.pattern('^[0-9]+$')]),
        user_profile_contact_type_id: new FormControl('',[Validators.pattern('^[0-9]+$')]),
        user_profile_contact_category_id: new FormControl('',[Validators.pattern('^[0-9]+$')])
      }),
      new FormGroup({
        id: new FormControl(),
        prefix: new FormControl('',[Validators.pattern('^[0-9]+$')]),
        number: new FormControl('',[Validators.pattern('^[0-9]+$')]),
        user_profile_contact_type_id: new FormControl('',[Validators.pattern('^[0-9]+$')]),
        user_profile_contact_category_id: new FormControl('',[Validators.pattern('^[0-9]+$')])
      })
    ]),
    addresses: new FormArray([
      new FormGroup({
        id: new FormControl(),
        zip: new FormControl('',[Validators.pattern('^[0-9]{5}$')]),                                //Erledigt
        city: new FormControl('',[Validators.minLength(2)]),                                        //Erledigt
        street: new FormControl('',[Validators.minLength(2)]),                                      //Erledigt
        house_number: new FormControl('',[Validators.pattern('^[0-9a-zA-ZäöüßÄÖÜ\\-\\/\\. ]+$')]),  //Erledigt
        user_profile_address_category_id: new FormControl('',[Validators.pattern('^[0-9]+$')])      //Erledigt
      })
    ]),
    banks: new FormArray([
      new FormGroup({
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
    ])
  })


  constructor(
    public partnerService: PartnerService,
    private mainNavbarService: MainNavbarService
  ){
    //console.log(this.addresses)
  }

  ngOnInit() {
    // get success created or updated
    this.partnerService.success$.subscribe(message => {
      if(message == 'created'){
        this.partnerService.setFormDirty(false)
        this.mainNavbarService.setIconState('save', true, true)
        this.userProfilesForm.reset()
        this.dataLoadedOrNew = false
        this.active = 1
        this.partnerService.fetchData()
      }
      console.log(message); // или отобразите это сообщение в интерфейсе
    });

    // get Errors
    this.partnerService.errors$.subscribe(errors => {
      console.log(errors)
      this.mainNavbarService.setIconState('save', true, true)
   
      if (errors?.vp_nr !== undefined && errors?.vp_nr[0] === "The vp nr has already been taken."){
        this.userProfilesForm.controls['vp_nr'].setErrors({vpNrExists: true});
      }
      if (errors?.email !== undefined && errors?.email[0] === "The email has already been taken.") {
        this.userProfilesForm.controls['email'].setErrors({emailExists: true});
        this.mainNavbarService.setIconState('save', true, true)
      }
    });

    // get Partner und ptch in Form
    if(this.partnerService){
      this.partnerService.detailedData$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {       
          console.log(data)
          if(data){
            this.userProfilesForm.reset()
            this.partnerService.setFormDirty(false), 
            this.mainNavbarService.setIconState('save', true, true)
            this.userProfilesForm.patchValue(data)
            this.dataLoadedOrNew = true
          }else if(data == null){
            console.log(data)
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
        if(this.userProfilesForm.dirty && this.userProfilesForm.valid) { //          
            this.partnerService.setFormDirty(this.userProfilesForm.dirty);
            this.mainNavbarService.setIconState('save', true, false);       
        }
      })

    // click btns  
    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(iconName => {
        if (iconName === 'new' && this.active === 1) {
            this.setDataNewUserProfile()
            this.dataLoadedOrNew = true          
            console.log('new')
          // Обработка нажатия на иконку new
        }

        if (iconName === 'save' && this.active === 1) {
          let value = this.getDirtyValues(this.userProfilesForm)
          if(this.userProfilesForm.get('id')?.value != null){
            value['id'] = this.userProfilesForm.get('id')?.value
          }else{
            this.partnerService.addItem(this.userProfilesForm.getRawValue())
          }
          console.log(this.userProfilesForm.valid)
          //this.partnerService.addItem(this.userProfilesForm.getRawValue())
          // console.log(this.userProfilesForm)
          // console.log(this.userProfilesForm.getRawValue())
          // console.log(this.userProfilesForm.get('id')?.value != null)
           //console.log(this.getDirtyValues(this.userProfilesForm))
          
          // Обработка нажатия на иконку save
        }
      });
  }

  setDataNewUserProfile(){
    this.partnerService.resetDetailedData()
    this.userProfilesForm.reset()
    this.partnerService.setFormDirty(false)
    this.mainNavbarService.setIconState('save', true, true)
    this.userProfilesForm.patchValue({
      'salutation': 'Herr',
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

  get contacts() {
    return this.userProfilesForm.get('contacts') as FormArray;
  }

  get addresses() {
    return this.userProfilesForm.get('addresses') as FormArray;
  }

  get banks(){
    return this.userProfilesForm.get('banks') as FormArray;
  }

//   getDirtyValues(form: any) {
//     let dirtyValues:any = form instanceof FormGroup ? {} : [];

//     Object.keys(form.controls)
//         .forEach(key => {
//             let currentControl = form.controls[key];

//             if (currentControl.dirty) {
//                 if (currentControl.controls)
//                     dirtyValues[key] = this.getDirtyValues(currentControl);
//                 else
//                     dirtyValues[key] = currentControl.value;
//             }
//         });

//     return dirtyValues;
// }

  getDirtyValues(form: any) {
    let dirtyValues: any = form instanceof FormGroup ? {} : [];
    Object.keys(form.controls).forEach(key => {
        let currentControl = form.controls[key];

        if (currentControl.dirty) {
            if (currentControl instanceof FormGroup || currentControl instanceof FormArray) {
                const nestedDirtyValues = this.getDirtyValues(currentControl);
                if (Object.keys(nestedDirtyValues).length > 0 && currentControl.get('id')?.value != null) {
                    nestedDirtyValues['id'] = currentControl.get('id')?.value;
                }
                dirtyValues[key] = nestedDirtyValues;
            } else {
                dirtyValues[key] = currentControl.value;
            }
        }
    });

    return dirtyValues;
  }

  isFieldRequired(fieldName: string): boolean {
    console.log(fieldName)
    const control = this.userProfilesForm.get(fieldName);
    if (!control) return false;
    const validator = control.validator ? control.validator({} as AbstractControl) : null;
    return validator && validator["required"];
  }


  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
