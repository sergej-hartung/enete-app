import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductGroupComponent } from './product-group/product-group.component';
import { ProductListComponent } from './product-list/product-list.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailsComponent,
    ProductGroupComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    NgbNavModule,
  ]
})
export class ProductsModule { }
