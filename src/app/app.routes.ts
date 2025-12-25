import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home-page.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { roleGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: MainLayoutComponent, children: [
        { path: '', component: HomeComponent },
        { path: 'resenhas', loadComponent: () => import('./pages/content-feed-page/content-feed-page.component').then(m => m.ContentFeedComponent) },
        { 
            path: 'novo-post', 
            loadComponent: () => import('./pages/novo-post-page/novo-post-page.component').then(m => m.NovoPostComponent),
            canMatch: [roleGuard],
            data: { roles: ['writer', 'admin'] }
        },
        {
            path: 'editar-post/:slug',
            loadComponent: () => import('./pages/edit-post-page/edit-post-page.component').then(m => m.EditPostPageComponent),
            canMatch: [roleGuard],
            data: { roles: ['writer', 'admin'], contentType: 'post' }
        },
        {
            path: 'editar-resenha/:slug',
            loadComponent: () => import('./pages/edit-post-page/edit-post-page.component').then(m => m.EditPostPageComponent),
            canMatch: [roleGuard],
            data: { roles: ['writer', 'admin'], contentType: 'review' }
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
