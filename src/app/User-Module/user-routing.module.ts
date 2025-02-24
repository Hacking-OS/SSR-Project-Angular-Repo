import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetpasswordComponent } from './Components/Forgot-password/forgetpassword.component';
import { LoginComponent } from './Components/Login/login.component';
import { MessengerComponent } from './Components/Messenger/messenger.component';
import { SignupComponent } from './Components/Signup/signup.component';
import { VerifyUserComponent } from './Components/verify-user/verify-user.component';
import { PaymentIntegrationComponent } from './Components/payment-integration/payment-integration.component';
import { UserProfileComponent } from './Components/User-Profile/user-profile.component';
// import { HomeComponent } from '../Shared-Module/Components/Home/home.component';
import { UserFoundGuard } from '../Shared-Module/Guards/user-found.Guard';
import { UserNotFoundGuard } from '../Shared-Module/Guards/user-not-found.Guard';
import { PageNotFoundComponent } from '../Shared-Module/Components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'}, // Redirect to 'home' if path is empty
  {
    path: '',
    canActivate: [UserNotFoundGuard], // Protect all child routes with AuthGuard
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default to login page if not logged in
      { path: 'login', component: LoginComponent, canActivate: [UserNotFoundGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [UserNotFoundGuard] },
      { path: 'forgetpassword', component: ForgetpasswordComponent, canActivate: [UserNotFoundGuard] },
    ]
  },
  {
    path: '',
    canActivate: [UserFoundGuard], // Protect all child routes with AuthGuard
    children: [
      // { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to 'home' if path is empty
      { path: 'message', component: MessengerComponent, canActivate: [UserFoundGuard] },
      { path: 'userProfile', component: UserProfileComponent, canActivate: [UserFoundGuard] },
    ],
  },
  { path: 'verifyUser', component: VerifyUserComponent },
  { path: 'payment', component: PaymentIntegrationComponent },
  {
    path: '**', component: PageNotFoundComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class userRoutingModule { }
