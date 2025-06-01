import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    { path: '', component: MainLayoutComponent, children: [
        { path: '', component: HomeComponent }
    ] }
];
