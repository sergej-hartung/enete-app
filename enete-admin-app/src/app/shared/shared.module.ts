import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GenericTableComponent} from './components/generic-table/generic-table.component';
import {NotificationComponent} from './components/notification/notification.component';
import { CardComponent } from './components/card/card.component'
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModalComponent } from './components/editor-modal/editor-modal.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';



@NgModule({
  declarations: [GenericTableComponent, CardComponent, NotificationComponent, EditorModalComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbNavModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
  ],
  exports:[
    GenericTableComponent,
    CardComponent,
    NotificationComponent,
  ]
})
export class SharedModule { }
