import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddCategoryComponent } from './Components/category/category-add/add-category.component';
// import { HomeComponent } from '../Shared-Module/Components/Home/home.component';
import { AuthUserGuard } from '../Shared-Module/Guards/auth-user.Guard';
import { UserFoundGuard } from '../Shared-Module/Guards/user-found.Guard';
import { BillComponent } from './Components/bill/bill-listing/bill.component';
import { CartComponent } from './Components/cart/cart/cart.component';
import { CategoryComponent } from './Components/category/category-list/category.component';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { ProductAddComponent } from './Components/products/product-add/product-add.component';
import { ProductsComponent } from './Components/products/product-listing/products.component';
import { ProductViewComponent } from './Components/products/product-view/product-view.component';
import { PageNotFoundComponent } from '../Shared-Module/Components/page-not-found/page-not-found.component';

const routes: Routes = [
  // {path:'',component:HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to 'home' if path is empty
  {
    path: "",
    canActivate: [UserFoundGuard],
    children: [
      { path: 'bill', component: BillComponent, canActivate: [UserFoundGuard] },
      { path: 'cart', component: CartComponent, canActivate: [UserFoundGuard] },
      { path: 'product', component: ProductsComponent, canActivate: [UserFoundGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [UserFoundGuard] },
      { path: 'viewProduct', component: ProductViewComponent, canActivate: [UserFoundGuard] },
    ]
  },
  {
    path: "",
    canActivate: [AuthUserGuard],
    children: [
      { path: 'category', component: CategoryComponent, canActivate: [AuthUserGuard] },
      { path: 'productAdd', component: ProductAddComponent, canActivate: [AuthUserGuard] },
      { path: 'addCategory', component: AddCategoryComponent, canActivate: [AuthUserGuard] },
      // { path: 'viewProduct', component: ProductViewComponent, canActivate: [AuthUserGuard] },
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
export class cartRoutingModule { }
