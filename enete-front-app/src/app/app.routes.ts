import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./start-page/start-page.component').then(m => m.StartPageComponent),
    },
    { path: 'dashboard', redirectTo: '/' },
];
