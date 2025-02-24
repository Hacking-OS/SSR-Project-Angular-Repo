import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { HomeComponent } from '../Shared-Module/Components/Home/home.component';
import { UserFoundGuard } from '../Shared-Module/Guards/user-found.Guard';
import { PageNotFoundComponent } from '../Shared-Module/Components/page-not-found/page-not-found.component';
import { EntertainmentComponent } from './Components/entertainment/entertainment.component';
import { VideoComponent } from './Components/video/video.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'}, // Redirect to 'home' if path is empty
  {
    path: '',
    canActivate: [UserFoundGuard], // Protect all child routes with AuthGuard
    children: [
      // { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to 'home' if path is empty
      { path: 'movie', component: EntertainmentComponent, canActivate: [UserFoundGuard] },
      { path: 'video', component: VideoComponent, canActivate: [UserFoundGuard] },
    ],
  },
  {
    path: '**', component: PageNotFoundComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class mediaRoutingModule { }
