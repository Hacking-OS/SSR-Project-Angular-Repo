import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { userRoutingModule } from './user-routing.module';
import { ForgetpasswordComponent } from './Components/Forgot-password/forgetpassword.component';
import { LoginComponent } from './Components/Login/login.component';
import { MessengerComponent } from './Components/Messenger/messenger.component';
import { SignupComponent } from './Components/Signup/signup.component';
import { VerifyUserComponent } from './Components/verify-user/verify-user.component';
import { PaymentIntegrationComponent } from './Components/payment-integration/payment-integration.component';
import { UserProfileComponent } from './Components/User-Profile/user-profile.component';

import { FeatureModule } from '../Shared-Module/Features/feature.module';
import { MainModule } from '../Shared-Module/main.module';

import { NgToastModule } from 'ng-angular-popup';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DropdownModule } from 'primeng/dropdown';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectModule } from 'primeng/select';
import { MatSelectModule } from '@angular/material/select';

import { SocketService } from '../Shared-Module/Shared-Services/Socket-IO-Services/socket.io.service';
import { SharedService } from '../Shared-Module/Shared-Services/shared.Service';
import { HttpLoginService } from './Http-Services/login.HttpService';
import { provideClientHydration } from '@angular/platform-browser';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgetpasswordComponent,
    MessengerComponent,
    VerifyUserComponent,
    PaymentIntegrationComponent,
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    userRoutingModule,
    MainModule,
    FeatureModule,
    NgToastModule,
    BsDatepickerModule.forRoot(),
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    DropdownModule,
    MatSidenavModule,
    MatSelectModule,
    SelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    
  ],
  providers: [
    SocketService,
    {
      provide: HttpLoginService,
      useFactory: (injector: Injector, sharedService: SharedService) => {
        return new HttpLoginService(injector.get(HttpClient), injector, sharedService);
      },
      deps: [Injector, SharedService],
    },
    // provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class UserModule {}
