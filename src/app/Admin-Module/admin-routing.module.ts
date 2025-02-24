import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './Components/dashboard/admin.component';
import { AuthUserGuard } from '../Shared-Module/Guards/auth-user.Guard';
import { PageNotFoundComponent } from '../Shared-Module/Components/page-not-found/page-not-found.component';
import { UserDetailsUpdateComponent } from './Components/users/controls/user-details-update/user-details-update.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to 'home' if path is empty
  {
    path: '',
    canActivate: [AuthUserGuard],
    children: [
      { path: 'dashboard', component: AdminComponent, canActivate: [AuthUserGuard] },
      { path: 'controls/users', component: UserDetailsUpdateComponent, canActivate: [AuthUserGuard] },
    ]
  },
  {
    path: '**', component: PageNotFoundComponent,
  },
];

@NgModule({
  // declarations: [LoginComponent, SignupComponent, ForgetpasswordComponent],
  imports: [RouterModule.forChild(routes)],
  // imports: [CommonModule,RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class adminRoutingModule { }
