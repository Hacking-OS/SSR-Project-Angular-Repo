import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './Shared-Module/Components/page-not-found/page-not-found.component';

const routes: Routes = [  
  {
  path: '',
  // canActivate: [UserFoundGuard],
  children: [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '',  loadChildren: () => import('./Shared-Module/main.module').then((m) => m.MainModule), },
  ]
},
// {
//   path: 'content',
//   loadChildren: () => import('./User-Entertainment-Module/user-Entertainment.module').then((m) => m.MediaModule),
// },
// {
//   path: 'user',
//   // outlet: 'user',
//   loadChildren: () => import('./User-Module/user.module').then((m) => m.UserModule),
// },
// {
//   path: 'cartSystem',
//   loadChildren: () => import('./cartSystem-Module/cart.module').then((m) => m.CartModule),
// },
// {
//   path: 'admin',
//   // outlet: 'admin',
//   loadChildren: () => import('./Admin-Module/admin.module').then((m) => m.AdminModule),
// },
// {
//   path: '**',
//   component: PageNotFoundComponent,
// },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
