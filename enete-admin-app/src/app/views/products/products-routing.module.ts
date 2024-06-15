import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../common/layout/layout.component';
import { ProductsComponent } from './products.component';
import { FileManagerComponent } from './file-manager/file-manager.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:[
      {
        path: '', 
        component: ProductsComponent
      },
      {
        path: 'document-manager', 
        component: FileManagerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
