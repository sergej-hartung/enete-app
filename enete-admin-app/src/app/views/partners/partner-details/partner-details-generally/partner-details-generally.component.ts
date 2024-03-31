import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Status } from '../../../../models/partner/status/status';
import { Career } from '../../../../models/partner/career/career';
import { Categorie } from '../../../../models/partner/categorie/categorie';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { PartnerService } from '../../../../services/partner/partner.service';

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

  private textFilterSubject = new Subject<{ key: string; value: any }>();

  private unsubscribe$ = new Subject<void>();
  displayParentData: string = '';

  constructor(public partnerService: PartnerService,) {
    this.textFilterSubject
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(debounceTime(300)) // задержка для текстового ввода
      .subscribe(filter => this.applyFilter(filter));
  }

  ngOnInit() {
    this.userProfilesForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
      this.updateDisplayParentData();
    });
  }

  private updateDisplayParentData() {
    const parent = this.userProfilesForm?.get('parent')?.value;
    if (parent && parent.vp_nr && parent.first_name && parent.last_name) {
      this.displayParentData = `${parent.vp_nr}, ${parent.first_name} ${parent.last_name}`;
    } else {
      this.displayParentData = '';
    }
  }

  clearInput() {
    this.displayParentData = '';
  }

  restoreInputData() {
    if (!this.displayParentData.trim()) {
      this.updateDisplayParentData();
    }
  }

  onParentDataChange(newValue: string) {
    console.log(newValue)
        let key = 'search'
        let value = newValue
        this.textFilterSubject.next({ key, value });

  }
    // Здесь должна быть логика для обработки ввода пользователя и поиска/выбора нового пользователя.
    // Это может включать обновление this.userProfilesForm с новым объектом пользователя.
  

  applyFilter(filter: { key: string; value: any }) {
    this.partnerService?.confirmAction('filter', () => {
        this.partnerService.fetchData({         
          [filter.key]: filter.value
        });
    }) 
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
