import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

@NgModule({
  // declarations: [LoginComponent, SignupComponent, ForgetpasswordComponent],
imports: [RouterModule.forChild(routes)],
// imports: [CommonModule,RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class FeatureRoutingModule {}
