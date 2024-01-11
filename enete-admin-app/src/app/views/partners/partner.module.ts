import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner.component';
import { PartnersListComponent } from './partners-list/partners-list.component';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PartnerComponent,
    PartnersListComponent,
    PartnerDetailsComponent,
  ],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    SharedModule,
    NgbNavModule,
    ReactiveFormsModule
  ]
})
export class PartnerModule { }
