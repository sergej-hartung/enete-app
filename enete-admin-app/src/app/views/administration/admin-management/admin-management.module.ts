import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ImageCropperModule } from 'ngx-image-cropper';
import { AdminManagementRoutingModule } from './admin-management-routing.module';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { AdminManagementComponent } from './admin-management.component';
import { SharedModule } from '../../../shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';



@NgModule({
  declarations: [
    AdminManagementComponent,
    AdminListComponent,
    AdminDetailsComponent
  ],
  imports: [
    CommonModule,
    AdminManagementRoutingModule,
    ImageCropperModule,
    SharedModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    FormsModule
  ]
})
export class AdminManagementModule { }
