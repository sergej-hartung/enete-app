import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GenericTableComponent} from './components/generic-table/generic-table.component';
import {NotificationComponent} from './components/notification/notification.component';
import { CardComponent } from './components/card/card.component'
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [GenericTableComponent, CardComponent, NotificationComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbNavModule,
  ],
  exports:[
    GenericTableComponent,
    CardComponent,
    NotificationComponent
  ]
})
export class SharedModule { }
