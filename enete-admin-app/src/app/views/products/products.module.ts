import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductGroupComponent } from './product-group/product-group.component';
import { ProductListComponent } from './product-list/product-list.component';
import { NgbAccordionModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { TariffListComponent } from './product-list/tariff-list/tariff-list.component';
import { HardwareListComponent } from './product-list/hardware-list/hardware-list.component';
import { ProductAddEditComponent } from './product-add-edit/product-add-edit.component';
import { TariffAddEditComponent } from './product-add-edit/tariff-add-edit/tariff-add-edit.component';
import { HardwareAddEditComponent } from './product-add-edit/hardware-add-edit/hardware-add-edit.component';
import { TariffDetailsAEComponent } from './product-add-edit/tariff-add-edit/tariff-details-a-e/tariff-details-a-e.component';
import { TariffAttributeComponent } from './product-add-edit/tariff-add-edit/tariff-attribute/tariff-attribute.component';
import { TariffPromoComponent } from './product-add-edit/tariff-add-edit/tariff-promo/tariff-promo.component';
import { TariffCalcMatrixComponent } from './product-add-edit/tariff-add-edit/tariff-calc-matrix/tariff-calc-matrix.component';
import { TariffViewTemplateComponent } from './product-add-edit/tariff-add-edit/tariff-view-template/tariff-view-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule } from '@angular/material/snack-bar';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { TreeNodeComponent } from './file-manager/tree-node/tree-node.component';
import { FileSizePipe } from '../../shared/pipes/file-size.pipe';
import { AttributeBoxComponent } from './product-add-edit/tariff-add-edit/tariff-view-template/attribute-box/attribute-box.component';
import { TariffDetailsTplComponent } from './product-add-edit/tariff-add-edit/tariff-details-tpl/tariff-details-tpl.component';
import { TariffDetailsComponent } from './product-details/tariff-details/tariff-details.component';
import { TariffViewComponent } from './product-list/tariff-list/tariff-view/tariff-view.component';
import { TariffHeaderComponent } from './product-list/tariff-list/tariff-view/tariff-header/tariff-header.component';
import { TariffCommissionComponent } from './product-list/tariff-list/tariff-view/tariff-commission/tariff-commission.component';
import { TariffAttributeViewComponent } from './product-list/tariff-list/tariff-view/shared/tariff-attribute/tariff-attribute-view.component';
import { TariffDetailsViewComponent } from './product-list/tariff-list/tariff-view/tariff-details/tariff-details-view.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailsComponent,
    ProductGroupComponent,
    ProductListComponent,
    TariffListComponent,
    HardwareListComponent,
    ProductAddEditComponent,
    TariffAddEditComponent,
    HardwareAddEditComponent,
    TariffDetailsAEComponent,
    TariffAttributeComponent,
    TariffPromoComponent,
    TariffCalcMatrixComponent,
    TariffViewTemplateComponent,
    FileManagerComponent,
    TreeNodeComponent,
    AttributeBoxComponent,
    TariffDetailsTplComponent,
    TariffDetailsComponent,
    TariffViewComponent,
    TariffAttributeViewComponent,
    TariffHeaderComponent,
    TariffDetailsViewComponent,
    TariffCommissionComponent,
    //FileSizePipe,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    SharedModule,
    ReactiveFormsModule, 
    FormsModule,
    NgxDropzoneModule,
    
    DragDropModule, 
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    NgbAccordionModule,
    
    // CdkDropList, CdkDrag
  ]
})
export class ProductsModule { }
