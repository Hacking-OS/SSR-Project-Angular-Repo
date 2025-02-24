import { Component, signal } from '@angular/core';

import { profile, updateProfileWithoutError, updateProfileWithoutUpdated } from '../../Schemas/Interfaces/userprofile.Interface';
import { Router } from '@angular/router';
import { HttpLoginService } from '../../Http-Services/login.HttpService';
import { AlertService, AlertType } from '../../../Shared-Module/Alert-Services/alert.AlertService';
import { DecryptService } from '../../../Shared-Module/Shared-Services/Security-Services/decrypt.Service';
import { environment } from '../../../../environments/environment';
import { PostType } from '../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { SharedService } from '../../../Shared-Module/Shared-Services/shared.Service';

@Component({
    selector: 'app-userprofile',
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css',
    standalone: false
})
export class UserProfileComponent {
  test: Array<profile> = [];
  productImage: File | undefined = undefined;
  title = signal<string>("User Profile Update");
  baseUrl = environment.baseUrl;
  constructor(private sharedService:SharedService,private loginService: HttpLoginService, private alertService: AlertService, private router: Router, private decryptService: DecryptService) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    let query = `Select * from Users where id=${Number(this.sharedService.getUserInfo().userId)}`;
    // let query="Select * from Users where id=" + localStorage.getItem('userId');
    this.loginService.getDataAndSetList<updateProfileWithoutUpdated>(() => this.loginService.GetApiResponse<updateProfileWithoutUpdated, { query: string }>('/userProfile/getResults', { query: query }, PostType.POST), (response: updateProfileWithoutUpdated) => {
      this.test = this.decryptService.decrypt(response.message);
      // this.test = JSON.parse(this.decryptService.decrypt(decodeURIComponent(response.message))) as Array<profile>;
      // this.alertService.showAlert("User Found!", AlertType.Success);
      if (response?.error) {
        this.alertService.showAlert(response?.message, AlertType.Error);
      }
    });
  }

  updateProfile() {
    // console.log(this.productImage);
    // return;
    let formData = new FormData();
    formData.append('user', JSON.stringify(this.test[0]));
    if (this.productImage) {
      formData.append('image', this.productImage, this.productImage.name);
    }

    this.loginService.getDataAndSetList<updateProfileWithoutError>(() => this.loginService.GetApiResponse<updateProfileWithoutError, FormData>("/userProfile/updateUser", formData, PostType.POST), (response: updateProfileWithoutError) => { 
     if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('userName', response.updated.name);
      localStorage.setItem('email', response.updated.email);
      }
      this.router.navigateByUrl("/home");
      if (response?.updated === null) {
        this.alertService.showAlert(response.message, AlertType.Error);
      } else {
        this.alertService.showAlertPopup("Profile Updated!", "Success", AlertType.Success);
      }
    });

    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
    });
  }

  onFileSelected(file: File | undefined) {
    console.log(this.productImage);
    this.productImage = file;
    console.log('Selected file:', this.productImage);

  }
}
