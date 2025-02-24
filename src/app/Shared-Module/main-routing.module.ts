import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Components/Home/home.component';
import { DemoNgPrimeComponent } from './Components/demo-ng-prime/demo-ng-prime.component';
import { HmacAuthComponent } from './Components/demo-crypto-hmac/demo-crypto-hmac.component';
import { BreakUpAmountFormComponent } from './Components/forms/break-up-form.component';
import { TestComponent } from './Components/test/test.component';

// const routes: Routes = [];
const routes: Routes = [
        { path: 'home', component: HomeComponent },
        { path: 'tables', component: DemoNgPrimeComponent },
        { path: 'authCrypto', component: HmacAuthComponent },
        { path: 'testForm', component:BreakUpAmountFormComponent },
        { path: 'test', component:TestComponent },
];

@NgModule({
  // declarations: [LoginComponent, SignupComponent, ForgetpasswordComponent],
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  // imports: [CommonModule,RouterModule.forChild(routes)],
  exports: [RouterModule],
  // providers:[httpMainEndpointService]
})
export class MainRoutingModule { }
