import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Status } from '../../../../models/partner/status/status';
import { Career } from '../../../../models/partner/career/career';
import { Categorie } from '../../../../models/partner/categorie/categorie';

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
  



  get addresses() {
    return this.userProfilesForm.get('addresses') as FormArray;
  }

  get contacts() {
    return this.userProfilesForm.get('contacts') as FormArray;
  }

  get banks(){
    return this.userProfilesForm.get('banks') as FormArray;
  }
}
