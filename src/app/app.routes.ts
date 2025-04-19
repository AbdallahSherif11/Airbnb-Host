import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { noAuthGuard } from './core/guards/no-auth-guard/no-auth.guard';
import { authGuard } from './core/guards/auth-guard/auth.guard';

import { HouseDetailsComponent } from './features/pages/house-details/house-details.component';
import { ChatListComponent } from './features/components/chat-list/chat-list.component';
import { ChatComponent } from './features/components/chat/chat.component';
import { NotFoundComponent } from './core/pages/not-found/not-found.component'; // Import NotFoundComponent


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
        path: "auth/confirm-email",
        loadComponent: () => import('./core/pages/confirm-email/confirm-email.component').then(c => c.ConfirmEmailComponent)
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
        path: "myhouses",
        loadComponent: () => import('./features/pages/my-houses/my-houses.component').then(c => c.MyHousesComponent),
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
        path: 'chat', 
        component: ChatListComponent,
        canActivate: [authGuard], 
        children: [
            {
                path: ':userId',
                component: ChatComponent,
                canActivate: [authGuard] 
            }
        ]
    },
    {
        path: "**",
        loadComponent: () => import('./core/pages/not-found/not-found.component').then(c => c.NotFoundComponent)
    }
];
