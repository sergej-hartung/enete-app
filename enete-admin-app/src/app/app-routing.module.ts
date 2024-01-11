import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{ path: 'login', loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule) },
  {
    path: 'partner',
    loadChildren: () => import('./views/partners/partner.module').then(m => m.PartnerModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
