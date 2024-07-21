import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GenericTableComponent} from './components/generic-table/generic-table.component';
import {NotificationComponent} from './components/notification/notification.component';
import { CardComponent } from './components/card/card.component'
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagerModalComponent } from './components/file-manager-modal/file-manager-modal.component';
import { TreeNodeModalComponent } from './components/file-manager-modal/tree-node-modal/tree-node-modal.component';
//import { CKEditorModule } from '@ckeditor/ckeditor5-angular';



@NgModule({
  declarations: [
    GenericTableComponent, 
    CardComponent, 
    NotificationComponent, 
    FileManagerModalComponent, 
    TreeNodeModalComponent
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbNavModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    GenericTableComponent,
    CardComponent,
    NotificationComponent,
  ]
})
export class SharedModule { }
