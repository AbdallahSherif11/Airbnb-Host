import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { noAuthGuard } from './core/guards/no-auth-guard/no-auth.guard';
import { authGuard } from './core/guards/auth-guard/auth.guard';
import { ChatListComponent } from './features/components/chat-list/chat-list.component';
import { ChatComponent } from './features/components/chat/chat.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: "auth",
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

    // Pages with AppLayout (app-navbar)
    {
        path: "",
        component: MainLayoutComponent,
        children: [
            {
                path: "",
                loadComponent: () => import('./features/pages/home/home.component').then(c => c.HomeComponent)
            },
            {
                path: "home",
                loadComponent: () => import('./features/pages/home/home.component').then(c => c.HomeComponent)
            },
            {
                path: "houses/:id",
                loadComponent: () => import('./features/pages/house-details/house-details.component').then(c => c.HouseDetailsComponent)
            },
            {
                path: "search",
                loadComponent: () => import('./core/pages/search/search.component').then(c => c.SearchComponent),
                title: "Search Results - Stayin'"
            },
            {
                path: "terms",
                loadComponent: () => import('./features/pages/static-pages/terms.component').then(c => c.TermsComponent),
                title: "Terms - Stayin'"
            },
            {
                path: "sitemap",
                loadComponent: () => import('./features/pages/static-pages/sitemap.component').then(c => c.SitemapComponent),
                title: "Sitemap - Stayin'"
            },
            {
                path: "privacy",
                loadComponent: () => import('./features/pages/static-pages/privacy.component').then(c => c.PrivacyComponent),
                title: "Privacy Policy - Stayin'"
            },
            {
                path: "privacy-choices",
                loadComponent: () => import('./features/pages/static-pages/privacy-choices.component').then(c => c.PrivacyChoicesComponent),
                title: "Privacy Choices - Stayin'"
            }
        ]
    },

    // Pages with AuthLayout (auth-navbar)
    {
        path: "",
        component: AuthLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: "wishlist",
                loadComponent: () => import('./features/pages/wishlist/wishlist.component').then(c => c.WishlistComponent)
            },
            {
                path: "myhouses",
                loadComponent: () => import('./features/pages/my-houses/my-houses.component').then(c => c.MyHousesComponent)
            },
            {
                path: "my-trips",
                loadComponent: () => import('./features/components/my-trips/my-trips.component').then(m => m.MyTripsComponent)
            },
            {
                path: "wallet",
                loadComponent: () => import('./features/components/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
            },
            {
                path: "profile",
                loadComponent: () => import('./features/pages/user-profile/user-profile.component').then(c => c.UserProfileComponent),
                canActivate: [authGuard]
            },
            {
                path: "addhouse",
                loadComponent: () => import('./features/pages/listing-create/listing-create.component').then(c => c.ListingCreateComponent)
            },
            {
                path: "updatehouse/:id",
                loadComponent: () => import('./features/pages/listing-update/listing-update.component').then(c => c.ListingUpdateComponent)
            },
            {
                path: "chat",
                component: ChatListComponent,
                children: [
                    {
                        path: ":userId",
                        component: ChatComponent
                    }
                ]
            }
        ]
    },

    // Other Pages (No Layout)
    
    
    {
        path: "payment/success",
        loadComponent: () => import('./features/pages/payment/payment-success.component').then(c => c.PaymentSuccessComponent),
        canActivate: [authGuard]
    },
    {
        path: "payment/cancel",
        loadComponent: () => import('./features/pages/payment/payment-cancel.component').then(c => c.PaymentCancelComponent),
        canActivate: [authGuard]
    },
    {
        path: "auth/confirm-email",
        loadComponent: () => import('./core/pages/confirm-email/confirm-email.component').then(c => c.ConfirmEmailComponent),
        canActivate: [noAuthGuard]
    },

    // Wildcard Route (Not Found)
    {
        path: "**",
        loadComponent: () => import('./core/pages/not-found/not-found.component').then(c => c.NotFoundComponent)
    }
];
