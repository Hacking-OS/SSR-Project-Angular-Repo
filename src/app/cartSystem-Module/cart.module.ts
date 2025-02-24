import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductAddComponent } from './Components/products/product-add/product-add.component';
import { AddCategoryComponent } from './Components/category/category-add/add-category.component';
import { FeatureModule } from '../Shared-Module/Features/feature.module';
// import { AutherizeInterceptor } from '../Shared-Module/Interceptors/autherize.Interceptor';
import { MainModule } from '../Shared-Module/main.module';
import { BillComponent } from './Components/bill/bill-listing/bill.component';
import { CartComponent } from './Components/cart/cart/cart.component';
import { CategoryComponent } from './Components/category/category-list/category.component';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { ProductsComponent } from './Components/products/product-listing/products.component';
import { HttpCartService } from './Http-Services/cart.HttpService';
import { BillService } from './Services/bill.Service';
import { CartService } from './Services/cart.Service';
import { CategoryService } from './Services/category.Service';
import { ProductService } from './Services/product.Service';
import { cartRoutingModule } from './cart-routing.module';
// import { HttpCartEndPointService } from './Http-Services/cart-end-point.HttpService';
import { ProductViewComponent } from './Components/products/product-view/product-view.component';
// import { httpInterceptorProviders } from '../Shared-Module/Interceptors';
// import { EndpointBase } from '../Shared-Module/Shared-Services/TokenServices/API-basePoint.TokenService';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedService } from '../Shared-Module/Shared-Services/shared.Service';

@NgModule({ declarations: [BillComponent, CartComponent, CheckoutComponent, ProductsComponent, ProductAddComponent, CategoryComponent, AddCategoryComponent, ProductViewComponent], imports: [MatSlideToggleModule,MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        ProductService,
        CartService,
        CategoryService,
        BillService,
        cartRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MainModule,
        FeatureModule], providers: [
        // HttpCartService,
        // HttpCartEndPointService,
        {
            provide: HttpCartService,
            useFactory: (injector: Injector,sharedService:SharedService) => {
                return new HttpCartService(injector.get(HttpClient), injector,sharedService);
            },
            deps: [ Injector,SharedService],
        },
        // provideHttpClient(withInterceptorsFromDi()),
    ] })
export class CartModule {}
