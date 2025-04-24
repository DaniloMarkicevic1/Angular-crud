import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './auth/auth-guard.guard';
import { ExpensesComponent } from './features/expenses/expenses.component';

export const routes: Routes = [
  {
    path: "", component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: "expenses", component: ExpensesComponent,
    canActivate: [authGuard]
  },
  // {
  //   path: "user", component: UserProfileComponent,
  // },
  {
    path: "login", component: LoginComponent
  },
  {
    path: "signup", component: SignupComponent
  },
];
