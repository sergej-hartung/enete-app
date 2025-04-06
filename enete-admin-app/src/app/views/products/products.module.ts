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
import { MatDialogModule } from '@angular/material/dialog';

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
import { TariffPromoViewComponent } from './product-list/tariff-list/tariff-view/tariff-promo/tariff-promo-view.component';
import { TariffSortingComponent } from './product-add-edit/tariff-add-edit/tariff-sorting/tariff-sorting.component';
import { ProductSettingsComponent } from './product-settings/product-settings.component';
import { TariffSettingsComponent } from './product-settings/tariff-settings/tariff-settings.component';
import { HardwareSettingsComponent } from './product-settings/hardware-settings/hardware-settings.component';
import { TariffGroupSettingsComponent } from './product-settings/tariff-settings/tariff-group-settings/tariff-group-settings.component';
import { TariffAttributeSettingsComponent } from './product-settings/tariff-settings/tariff-attribute-settings/tariff-attribute-settings.component';
import { TariffProviderSettingsComponent } from './product-settings/tariff-settings/tariff-provider-settings/tariff-provider-settings.component';
import { TariffNetworkOperatorSettingsComponent } from './product-settings/tariff-settings/tariff-network-operator-settings/tariff-network-operator-settings.component';
import { TariffSortingSettingsComponent } from './product-settings/tariff-settings/tariff-sorting-settings/tariff-sorting-settings.component';


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
    TariffPromoViewComponent,
    TariffCommissionComponent,
    TariffSortingComponent,
    ProductSettingsComponent,
    TariffSettingsComponent,
    HardwareSettingsComponent,
    TariffGroupSettingsComponent,
    TariffAttributeSettingsComponent,
    TariffProviderSettingsComponent,
    TariffNetworkOperatorSettingsComponent,
    TariffSortingSettingsComponent,
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
    MatDialogModule
    // CdkDropList, CdkDrag
  ]
})
export class ProductsModule { }
