import { SharedService } from './Shared-Services/shared.Service';
// import { PageLoaderService } from './Shared-Services/Loader-Services/page-loader-control.service';
import { Injector, NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './Components/Home/home.component';
import { ErrorComponent } from './Components/error/error.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { PageComponent } from './Components/page/page.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
// import { AutherizeInterceptor } from './Interceptors/autherize.Interceptor';
import { HttpMainService } from './Http-Services/main.HttpService';
import { FeatureModule } from './Features/feature.module';
// import { NotificationAlertService } from './Alert-Services/notification.AlertService';
// import { ToastrService } from 'ngx-toastr';
// import { httpInterceptorProviders } from './Interceptors';
// import { LoaderComponent } from './Components/loader/loader.component';
import { DemoNgPrimeComponent } from './Components/demo-ng-prime/demo-ng-prime.component';
// import { HttpMainEndpointService } from './HttpServices/main-end-point.HttpService';
// import { HttpLoginService } from '../User-Module/HttpServices/login.HttpService';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NotificationComponent } from './Alert-Services/notification/notification.component';
import { HmacAuthComponent } from './Components/demo-crypto-hmac/demo-crypto-hmac.component';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { MatCardModule } from '@angular/material/card';
import { BreakUpAmountFormComponent } from './Components/forms/break-up-form.component';
import { TestComponent } from './Components/test/test.component';
import { LoaderComponent } from './Components/loader/loader.component';
@NgModule({ declarations: [HomeComponent, HeaderComponent, FooterComponent, ErrorComponent, PageComponent, SidebarComponent, DemoNgPrimeComponent, LoaderComponent, NotificationComponent, HmacAuthComponent, BreakUpAmountFormComponent, TestComponent],
    exports: [HomeComponent, HeaderComponent, FooterComponent, ErrorComponent, PageComponent, SidebarComponent, DemoNgPrimeComponent, NotificationComponent, HmacAuthComponent, BreakUpAmountFormComponent,LoaderComponent], imports: [MainRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FeatureModule,
        TableModule,
        CarouselModule,
        ButtonModule,
        CardModule,
        DialogModule,
        MenubarModule,
        MatCardModule,
        PaginatorModule], providers: [
        // HttpMainService,  // Provide HttpMainService
        // HttpMainEndpointService, // Provide HttpMainEndpointService
        {
            provide: HttpMainService,
            useFactory: ( injector: Injector,sharedService:SharedService) => {
                return new HttpMainService(injector.get(HttpClient), injector,sharedService);
            },
            deps: [Injector,SharedService],
        },
        // provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class MainModule { }
