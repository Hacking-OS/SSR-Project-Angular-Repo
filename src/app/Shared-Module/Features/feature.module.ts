import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgToastModule } from 'ng-angular-popup';
// import { ToastrModule } from 'ngx-toastr';
import { FeatureRoutingModule } from './feature-routing.module';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { AutherizeInterceptor } from '../Interceptors/autherize.Interceptor';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { HttpFeatureService } from './Http-Services/feature.HttpService';
// import { httpInterceptorProviders } from '../Interceptors';
import { ProgressBarModule } from 'primeng/progressbar';
import { SharedService } from '../Shared-Services/shared.Service';
// import { HttpMainService } from '../HttpServices/main.HttpService';
// import { HttpFeatureEndPointService } from './FeatureServices/HttpServices/feature-end-point.HttpService';

@NgModule({ declarations: [FileUploaderComponent, ProgressBarComponent],
    exports: [FileUploaderComponent, ProgressBarComponent], imports: [FeatureRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProgressBarModule], providers: [
        // HttpMainService,
        // HttpFeatureService,
        // HttpFeatureEndPointService,
        {
            provide: HttpFeatureService,
            useFactory: (injector: Injector,sharedService:SharedService) => {
                return new HttpFeatureService(injector.get(HttpClient), injector,sharedService);
            },
            deps: [Injector,SharedService],
        },
        // httpInterceptorProviders
        // { provide: HTTP_INTERCEPTORS, useClass: AutherizeInterceptor, multi: true },
        // provideHttpClient(withInterceptorsFromDi())
    ] })
export class FeatureModule {}
