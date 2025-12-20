import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home-page.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { roleGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: MainLayoutComponent, children: [
        { path: '', component: HomeComponent },
        { path: 'resenhas', loadComponent: () => import('./pages/content-feed-page/content-feed-page.component').then(m => m.ContentFeedComponent) },
        { 
            path: 'nova-resenha', 
            loadComponent: () => import('./pages/nova-resenha-page/nova-resenha-page.component').then(m => m.NovaResenhaComponent),
            canMatch: [roleGuard],
            data: { roles: ['writer', 'admin'] }
         },
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
