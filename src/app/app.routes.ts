import { Routes } from '@angular/router';
import { CreateAccount } from "./components/create-account/create-account";
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'create-account',
    component: CreateAccount
  },
  {
    path: '',
    component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard/:id',
    component: Dashboard
  }
];
