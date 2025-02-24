import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { ToastrModule } from 'ngx-toastr';
import { adminRoutingModule } from './admin-routing.module';
import { HttpAdminService } from './Http-Services/admin.HttpService';
import { FeatureModule } from '../Shared-Module/Features/feature.module';
import { MainModule } from '../Shared-Module/main.module';
import { UserService } from '../User-Module/Services/user.Service';
import { AdminComponent } from './Components/dashboard/admin.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { OptionsAddComponent } from './Components/users/options/options-add/options-add.component';
import { OptionsViewComponent } from './Components/users/options/options-view/options-view.component';
import { OptionsUpdateComponent } from './Components/users/options/options-update/options-update.component';
import { StatusUpdateComponent } from './Components/users/controls/status-update/status-update.component';
import { UserPurchasingComponent } from './Components/users/controls/user-purchasing/user-purchasing.component';
import { UserDetailsUpdateComponent } from './Components/users/controls/user-details-update/user-details-update.component';
import { UpdateUserSettingsComponent } from './Components/settings/update-user-settings/update-user-settings.component';
import { UpdateAdminSettingsComponent } from './Components/settings/update-admin-settings/update-admin-settings.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts'; // Import echarts
import { AddUserDialogComponent } from './Components/users/controls/user-purchasing/dialog.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SharedService } from '../Shared-Module/Shared-Services/shared.Service';

@NgModule({
  declarations: [
    AdminComponent,
    OptionsAddComponent,
    OptionsViewComponent,
    OptionsUpdateComponent,
    StatusUpdateComponent,
    UserPurchasingComponent,
    UserDetailsUpdateComponent,
    UpdateUserSettingsComponent,
    UpdateAdminSettingsComponent,
    AddUserDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTooltipModule,

    adminRoutingModule,
    NgToastModule,
    ToastrModule.forRoot({
      timeOut: 3000, // Display time in milliseconds
      positionClass: 'toast-top-right', // Position of toastr
      preventDuplicates: true, // Prevent duplicate toasts
    }),
    NgxEchartsModule.forRoot({ echarts }),
    MainModule,
    FeatureModule,
  ],
  providers: [
    // HttpAdminService,
    // HttpMainAdminEndPointService,
    {
      provide: 'NGX_ECHARTS_CONFIG', // Provide the config
      useValue: {
        echarts: echarts, // Make sure echarts instance is passed
      },
    },
    UserService,
    {
      provide: HttpAdminService,
      useFactory: (injector: Injector,sharedService:SharedService) => {
        return new HttpAdminService(injector.get(HttpClient), injector,sharedService);
      },
      deps: [Injector,SharedService],
    },
    // provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AdminModule {}
