import { Injector, NgModule } from '@angular/core';
import { mediaRoutingModule } from './user-Entertainment-routing.module';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpMediaService } from './Http-Services/media.HttpService';
import { MessengerService } from './Services/messenger.Service';
import { UserService } from './Services/user.Service';
// import { AutherizeInterceptor } from '../Shared-Module/Interceptors/autherize.Interceptor';
import { FeatureModule } from '../Shared-Module/Features/feature.module';
import { MainModule } from '../Shared-Module/main.module';
// import { HttpLoginEndPointService } from './Http-Services/login-end-point.HttpService';
// import { EndpointBase } from '../Shared-Module/Shared-Services/TokenServices/API-basePoint.TokenService';
// import { AlertService } from '../Shared-Module/Alert-Services/alert.AlertService';
import { NgToastModule } from 'ng-angular-popup';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
// import { httpInterceptorProviders } from '../Shared-Module/Interceptors';
import { EntertainmentComponent } from './Components/entertainment/entertainment.component';
import { AudioComponent } from './Components/audio/audio.component';
import { VideoComponent } from './Components/video/video.component';
import { SharedService } from '../Shared-Module/Shared-Services/shared.Service';
import { provideClientHydration } from '@angular/platform-browser';
// import { SharedService } from '../Shared-Module/Shared-Services/shared.Service';





@NgModule({ declarations: [EntertainmentComponent, AudioComponent, VideoComponent], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        mediaRoutingModule,
        UserService,
        MessengerService,
        MainModule,
        FeatureModule,
        NgToastModule,
        BsDatepickerModule.forRoot(),
        NgToastModule,
        ToastrModule.forRoot({
            timeOut: 3000, // Display time in milliseconds
            positionClass: 'toast-top-right', // Position of toastr
            preventDuplicates: true, // Prevent duplicate toasts
        })], providers: [
        //  HttpLoginService,
        //  HttpLoginEndPointService,
        provideClientHydration(),
        {
            provide: HttpMediaService,
            useFactory: (injector: Injector,sharedService:SharedService) => {
                return new HttpMediaService(injector.get(HttpClient), injector,sharedService);
            },
            deps: [Injector,SharedService],
        },
        // provideHttpClient(withInterceptorsFromDi()),
    ] })
export class MediaModule { }
