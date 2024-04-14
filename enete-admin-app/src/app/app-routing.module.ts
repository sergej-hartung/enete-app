import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { 
    path: 'login', 
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule) },
  {
    path: 'partner',
    loadChildren: () => import('./views/partners/partner.module').then(m => m.PartnerModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./views/products/products.module').then(m => m.ProductsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'admin-management',
    loadChildren: () => import('./views/administration/admin-management/admin-management.module').then(m => m.AdminManagementModule),
    canLoad: [AuthGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
