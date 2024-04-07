import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Status } from '../../../../models/partner/status/status';
import { Career } from '../../../../models/partner/career/career';
import { Categorie } from '../../../../models/partner/categorie/categorie';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, map, of, switchMap, takeUntil, tap } from 'rxjs';
//import { PartnerService } from '../../../../services/partner/partner.service';
import { ParentService } from "../../../../services/partner/parent/parent.service"
import { PartnerData, Partner } from '../../../../models/partner/partner';

class RequiredStatus {
  [key: string]: boolean;
}

@Component({
  selector: 'app-partner-details-generally',
  templateUrl: './partner-details-generally.component.html',
  styleUrl: './partner-details-generally.component.scss'
})
export class PartnerDetailsGenerallyComponent {
  @Input() userProfilesForm!: FormGroup;
  @Input() dataLoadedOrNew!: boolean; 
  @Input() requiredStatus!: RequiredStatus; 
  @Input() statuses!: Status[]; 
  @Input() careers!: Career[]; 
  @Input() categories!: Categorie[];

 // private textFilterSubject = new Subject<{ key: string; value: any }>();

  private unsubscribe$ = new Subject<void>();
  searching = false;
	searchFailed = false;
  displayParentData: Partner | null = null ;

  constructor(public parentService: ParentService,) {
    // this.textFilterSubject
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .pipe(debounceTime(300)) // задержка для текстового ввода
    //   .subscribe(filter => this.applyFilter(filter));
  }

  ngOnInit() {
    this.userProfilesForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
      this.updateDisplayParentData();
    });

  }


    search: OperatorFunction<string, readonly Partner[]> = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.searching = true)),
        switchMap(term => {
            if (term.length < 2) {
                // Immediately return an empty array if the search term is too short
                return of([]);
            }else{
                
              this.applyFilter({key: 'search', value: term})
              return this.parentService.data$.pipe(
                map(response => {
                  //  
                  if(response && response['data']){
                    //return response['data'].map((item: any) => `${item.vp_nr}, ${item.first_name} ${item.last_name}`)
                    return response['data']
                  }else{
                    return []
                  }
                })
              )
            }
        }),
        tap(() => (this.searching = false)),
    );

  selectedParentEmployee(){
      
    if(this.displayParentData && this.displayParentData['id']){
      const parent = this.userProfilesForm?.get('parent')
      parent?.patchValue({...this.displayParentData})
      parent?.markAsDirty()
    }
      
  }

  formatter = (x: Partner | null) => `${x?.vp_nr}, ${x?.first_name} ${x?.last_name}`;

  private updateDisplayParentData() {
    const parent = this.userProfilesForm?.get('parent')?.value;
    if (parent && parent.vp_nr && parent.first_name && parent.last_name) {
      this.displayParentData = parent;
    } else {
      this.displayParentData = null;
    }
  }

  clearInput() {
    //this.displayParentData = null;
  }

  restoreInputData() {
      
    if (!this.displayParentData) {
      this.updateDisplayParentData();
    }
  }

  // onParentDataChange(newValue: string) {
  //   )**)(newValue)
  //       let key = 'search'
  //       let value = newValue
  //       this.textFilterSubject.next({ key, value });

  // }
    // Здесь должна быть логика для обработки ввода пользователя и поиска/выбора нового пользователя.
    // Это может включать обновление this.userProfilesForm с новым объектом пользователя.
  

  applyFilter(filter: { key: string; value: any }) {
    this.parentService.fetchData({         
      [filter.key]: filter.value
    });
  }


  get addresses() {
    return this.userProfilesForm.get('addresses') as FormArray;
  }

  get contacts() {
    return this.userProfilesForm.get('contacts') as FormArray;
  }

  get banks(){
    return this.userProfilesForm.get('banks') as FormArray;
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    
  }
}
