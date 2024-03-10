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
import { PartnerDetailsNoteComponent } from './partner-details/partner-details-note/partner-details-note.component';
import { PartnerDetailsFileListComponent } from './partner-details/partner-details-file-list/partner-details-file-list.component';
import { FileSizePipe } from '../../shared/pipes/file-size.pipe';



@NgModule({
  declarations: [
    PartnerComponent,
    PartnersListComponent,
    PartnerDetailsComponent,
    PartnerDetailsGenerallyComponent,
    PartnerDetailsAccessComponent,
    PartnerDetailsNoteComponent,
    PartnerDetailsFileListComponent,
    FileSizePipe
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
