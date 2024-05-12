import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductGroupComponent } from './product-group/product-group.component';
import { ProductListComponent } from './product-list/product-list.component';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
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
    TariffViewTemplateComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    NgbNavModule,
    NgbDropdownModule,
    SharedModule,
    //ReactiveFormsModule, 
    FormsModule,
    NgxDropzoneModule,
  ]
})
export class ProductsModule { }
