import { Component } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, AlertType } from '../../../Shared-Module/Alert-Services/alert.AlertService';
import { HttpLoginService } from '../../Http-Services/login.HttpService';
import { PostType } from '../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { baseResponse } from '../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';

@Component({
    selector: 'app-forgetpassword',
    templateUrl: './forgetpassword.component.html',
    styleUrls: ['./forgetpassword.component.css'],
    standalone: false
})
export class ForgetpasswordComponent {
  condition:boolean|undefined=false


  userData={
        email:"",
        password:"",
        name:"",
        phone:"",
    }

    checkboxval:any=[];

    message: string | any;
    ipAddress: any;
    usersDataFromDatabase:any;

    constructor(private fBuilder: FormBuilder, private router: Router, private loginService : HttpLoginService,private alertService:AlertService) {
      this.ipAddress =  '127.0.0.1';
    }

    postData(formData:NgForm):void {
      // /users/forgetpassword
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    this.loginService.getDataAndSetList<baseResponse>(() => this.loginService.GetApiResponse<baseResponse, { userInput: { email: string, password: string , name:string, phone:string }, userIp: string , userLocation:string}>('/users/forgetpassword', { userInput: this.userData, userIp: this.ipAddress , userLocation:window.location.origin},PostType.POST), (data: baseResponse) => {

      this.alertService.showAlert(data.message,AlertType.Success);
              formData.reset();
              this.router.navigateByUrl('user/login');
    });
  }
    }

    checkboxEventHandler(event: any) {
      const lang = this.checkboxval;
      if (event.target.checked) {
        lang.push(event.target.value);
      } else {
        const index = lang.findIndex((x: any) => x === event.target.value);
        lang.splice(index,1);
      }
    }
}
