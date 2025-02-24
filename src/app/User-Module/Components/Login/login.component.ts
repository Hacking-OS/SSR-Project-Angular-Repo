import { Component } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService, AlertType } from '../../../Shared-Module/Alert-Services/alert.AlertService';
import { PostType } from '../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { baseResponse } from '../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';
import { DecryptService } from '../../../Shared-Module/Shared-Services/Security-Services/decrypt.Service';
import { SharedService } from '../../../Shared-Module/Shared-Services/shared.Service';
import { HttpLoginService } from '../../Http-Services/login.HttpService';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  condition: boolean | undefined = false;


  userData = {
    email: "",
    password: "",
  }

  checkboxval: any = [];

  message: string | any;
  ipAddress: any;
  usersDataFromDatabase: any;

  constructor(private fBuilder: FormBuilder, private router: Router, private alertService: AlertService, private decryptService: DecryptService, private sharedService: SharedService, private loginService: HttpLoginService) {

  }


  redirectUser(redirectTo: string) {
    this.router.navigateByUrl("/" + redirectTo);
  }

  LoginFormSubmit(formData: NgForm): void {
    this.loginService.getDataAndSetList<baseResponse>(() => this.loginService.GetApiResponse<baseResponse, { userInput: { email: string, password: string }, IpAddress: string }>('/users/login', { userInput: this.userData, IpAddress: this.ipAddress },PostType.POST), (data: baseResponse) => {
      if (data.message) {
        this.sharedService.setUserDetails(data.message);
        this.alertService.showAlert("Login Successfully!", AlertType.Success);

        this.sharedService.getUserCount();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 4500);
        formData.reset();
      }
    });
  }

  // .catch((error: HttpErrorResponse) => {
  //   console.log("API has been Rejected with an Error : ", error);
  //   this.alertService.showErrorPopup(error, AlertType.Error);
  //   formData.reset();
  // });

  checkboxEventHandler(event: any) {
    const lang = this.checkboxval;
    if (event.target.checked) {
      lang.push(event.target.value);
    } else {
      const index = lang.findIndex((x: any) => x === event.target.value);
      lang.splice(index, 1);
    }
  }
}
