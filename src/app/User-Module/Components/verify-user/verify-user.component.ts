import { SharedService } from './../../../Shared-Module/Shared-Services/shared.Service';
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpLoginService } from '../../Http-Services/login.HttpService'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { AlertService, AlertType } from '../../../Shared-Module/Alert-Services/alert.AlertService'
import { PostType } from '../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum'
import { baseResponse } from '../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface'
import { DecryptService } from '../../../Shared-Module/Shared-Services/Security-Services/decrypt.Service'


@Component({
    selector: 'app-verify-user',
    templateUrl: './verify-user.component.html',
    styleUrl: './verify-user.component.css',
    standalone: false
})
export class VerifyUserComponent {
  public message?: string
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertService,
    private http: HttpClient,
    private loginService: HttpLoginService,
    private decryptService: DecryptService,
    private sharedService:SharedService
  ) { }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // Access individual parameters
      const verifyUser = params['verifyUser'];
      if (this.sharedService.getUserSessionInfo()?.access_token) {
        this.alert.showAlertPopup('User verified Already!','User Verified',AlertType.Success);
        this.router.navigate(['']);
        return;
      }

      if (verifyUser) {
        try {
          this.loginService.getDataAndSetList<baseResponse>(() => this.loginService.GetApiResponse<baseResponse, {verifyUser:string}>('/users/VerifyUser', {verifyUser:encodeURIComponent(verifyUser)}, PostType.POST), (response: baseResponse) => {
            const isValidUser  = this.checkUser<baseResponse>(response);
            if (isValidUser) {
               this.sharedService.setUserDetails(response.message);
              this.alert.showAlertPopup('User verified & Logged-in successfully !','Verification Success',AlertType.Success);
              this.router.navigate(['']);
            } else {
              this.alert.showAlertPopup('User verification failed!', 'Verification Failed', AlertType.Error);
              this.router.navigate(['']);
            }
          }).catch((error: HttpErrorResponse) => {
            this.alert.showAlertPopup('User verification failed!', 'Verification Failed', AlertType.Warning);
            this.router.navigate(['/home']);
          });
        } catch (error) {
          this.alert.showAlertPopup('User verification failed!', 'Verification Failed', AlertType.Error);
          this.router.navigate(['']);
        }
      } else {
        this.router.navigate(['/home']);
        return;
      }
    });
  }

  private checkUser<VerifiedObjList extends baseResponse>(response: VerifiedObjList): boolean {
    // Implement your user verification logic here
    return response instanceof String || response instanceof Object;
  }
}
