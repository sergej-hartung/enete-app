import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [
    // Startseite für nicht eingeloggte Benutzer
    {
        path: '',
        loadComponent: () => import('./pages/start-page/start-page.component').then(m => m.StartPageComponent),
    },
    // { 
    //     path: 'dashboard', 
    //     loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    //     canActivate: [AuthGuard]
    // },
    // Hauptbereich für eingeloggte Benutzer
    {
        path: 'main',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/main/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./pages/main/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
            // {
            //     path: 'profile',
            //     loadComponent: () => import('./pages/backend/profile/profile.component').then(m => m.ProfileComponent),
            // },
        ],
    },
    {
        path: '**', 
        redirectTo: ''
    },
];
