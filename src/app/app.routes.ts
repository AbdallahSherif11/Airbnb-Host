import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { noAuthGuard } from './core/guards/no-auth-guard/no-auth.guard';
import { authGuard } from './core/guards/auth-guard/auth.guard';

export const routes: Routes = [
    {
        path: "auth",
        component: AuthLayoutComponent,
        canActivate: [noAuthGuard],
        children: [
            {
                path: "register",
                loadComponent: () => import('../app/core/pages/register/register.component').then(c => c.RegisterComponent),
                canActivate: [noAuthGuard],
            },
            {
                path: "login",
                loadComponent: () => import('../app/core/pages/login/login.component').then(c => c.LoginComponent),
                canActivate: [noAuthGuard],
            },
        ]
    },
    {
        path: "",
        loadComponent: () => import('./features/pages/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: "home",
        loadComponent: () => import('./features/pages/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: "addhouse",
        loadComponent: () => import('./features/pages/listing-create/listing-create.component').then(c => c.ListingCreateComponent),
        canActivate: [authGuard],
    },
    {
        path: 'houses/:id',
        loadComponent: () => import('./features/pages/house-details/house-details.component').then(c => c.HouseDetailsComponent)
    },
    {
        path: 'search',
        loadComponent: () => import('./core/pages/search/search.component').then(c => c.SearchComponent),
        title: 'Search Results - Airbnb'
    },
    {
        path: 'terms',
        loadComponent: () => import('./features/pages/static-pages/terms.component').then(c => c.TermsComponent),
        title: 'Terms - Airbnb'
    },
    {
        path: 'sitemap',
        loadComponent: () => import('./features/pages/static-pages/sitemap.component').then(c => c.SitemapComponent),
        title: 'Sitemap - Airbnb'
    },
    {
        path: 'privacy',
        loadComponent: () => import('./features/pages/static-pages/privacy.component').then(c => c.PrivacyComponent),
        title: 'Privacy Policy - Airbnb'
    },
    {
        path: 'privacy-choices',
        loadComponent: () => import('./features/pages/static-pages/privacy-choices.component').then(c => c.PrivacyChoicesComponent),
        title: 'Privacy Choices - Airbnb'
    },
    {
        path: "**",
        loadComponent: () => import('./core/pages/not-found/not-found.component').then(c => c.NotFoundComponent)
    }
];
