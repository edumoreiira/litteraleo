import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    { path: '', component: MainLayoutComponent, children: [
        { path: '', component: HomeComponent },
        { path: 'resenhas', loadComponent: () => import('./pages/content-feed/content-feed.component').then(m => m.ContentFeedComponent) },
        { path: 'nova-resenha', loadComponent: () => import('./pages/nova-resenha/nova-resenha.component').then(m => m.NovaResenhaComponent) },
        { 
            path: 'resenha/:slug', 
            loadComponent: () => import('./pages/content-page/content-page.component').then(m => m.contentPageComponent),
            data: { contentType: 'review' }
        },
        { 
            path: 'post/:slug', 
            loadComponent: () => import('./pages/content-page/content-page.component').then(m => m.contentPageComponent),
            data: { contentType: 'post' }
        },
         
    ] }
];
