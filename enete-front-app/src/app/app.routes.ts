import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [
    // Startseite für nicht eingeloggte Benutzer
    {
        path: '',
        loadComponent: () => import('./pages/start-page/start-page.component').then(m => m.StartPageComponent),
    },
    {
        path: 'main',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/main/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            // {
            //     path: '',
            //     redirectTo: 'dashboard',
            //     pathMatch: 'full',
            // },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./pages/main/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
            {
                path: 'products',
                loadComponent: () => import('./pages/main/products/products.component').then(m => m.ProductsComponent),
                children: [
                    { path: 'energy', loadComponent: () => import('./pages/main/products/energy/energy.component').then(m => m.EnergyComponent) },
                    // { path: 'internet', loadComponent: () => import('./pages/main/products/internet/internet.component').then(m => m.InternetComponent) },
                    // { path: 'cellular-tariffs', loadComponent: () => import('./pages/main/products/cellular-tariffs/cellular-tariffs.component').then(m => m.CellularTariffsComponent) },
                    // { path: 'additional-products', loadComponent: () => import('./pages/main/products/additional-products/additional-products.component').then(m => m.AdditionalProductsComponent) },
                ],
            },
            
        ],
    },
    {
        path: '**', 
        redirectTo: ''
    },
];
