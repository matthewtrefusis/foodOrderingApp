import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home').then((m) => m.Home) },
  {
    path: 'menu/:id',
    loadComponent: () => import('./components/menu-detail/menu-detail').then((m) => m.MenuDetail),
  },
  { path: 'cart', loadComponent: () => import('./components/cart/cart').then((m) => m.Cart) },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup').then((m) => m.SignupComponent),
  },
];
