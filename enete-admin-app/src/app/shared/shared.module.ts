import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GenericTableComponent} from './components/generic-table/generic-table.component';
import {NotificationComponent} from './components/notification/notification.component';
import { CardComponent } from './components/card/card.component'



@NgModule({
  declarations: [GenericTableComponent, CardComponent, NotificationComponent],
  imports: [
    CommonModule
  ],
  exports:[
    GenericTableComponent,
    CardComponent,
    NotificationComponent
  ]
})
export class SharedModule { }
