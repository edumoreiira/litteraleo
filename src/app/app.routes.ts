import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    { path: '', component: MainLayoutComponent, children: [
        { path: '', component: HomeComponent },
        { path: 'resenhas', loadComponent: () => import('./pages/resenhas/resenhas.component').then(m => m.ResenhasComponent) },
        { path: 'nova-resenha', loadComponent: () => import('./pages/nova-resenha/nova-resenha.component').then(m => m.NovaResenhaComponent) },
        { path: 'resenha/:title/:id', loadComponent: () => import('./pages/resenha/resenha.component').then(m => m.ResenhaComponent) }
    ] }
];
