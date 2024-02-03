import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner.component';
import { PartnersListComponent } from './partners-list/partners-list.component';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PartnerDetailsGenerallyComponent } from './partner-details/partner-details-generally/partner-details-generally.component';
import { PartnerDetailsAccessComponent } from './partner-details/partner-details-access/partner-details-access.component';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [
    PartnerComponent,
    PartnersListComponent,
    PartnerDetailsComponent,
    PartnerDetailsGenerallyComponent,
    PartnerDetailsAccessComponent,
  ],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    SharedModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    ImageCropperModule,
    FormsModule
  ]
})
export class PartnerModule { }
