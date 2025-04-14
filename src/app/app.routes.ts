import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';

export const routes: Routes = [
  {path:"auth",component:AuthLayoutComponent,children:[
    {path:"register",loadComponent:()=>import('../app/core/pages/register/register.component').then(c=>c.RegisterComponent)},
    {path:"login",loadComponent:()=>import('../app/core/pages/login/login.component').then(c=>c.LoginComponent)},
  ]},
  {path:"",loadComponent:()=>import('./features/pages/home/home.component').then(c=>c.HomeComponent)},
  {path:"home",loadComponent:()=>import('./features/pages/home/home.component').then(c=>c.HomeComponent)},
  {path:"addhouse",loadComponent:()=>import('./features/pages/listing-create/listing-create.component').then(c=>c.ListingCreateComponent)},




  {path:"**",loadComponent:()=>import('./core/pages/not-found/not-found.component').then(c=>c.NotFoundComponent )}

];
