import { Component } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
// import { UserService } from '../../services/userServices/user.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { UserService } from '../../Services/user.Service';
import { AlertService, AlertType } from '../../../Shared-Module/Alert-Services/alert.AlertService';
import { HttpLoginService } from '../../Http-Services/login.HttpService';
import { PostType } from '../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { baseResponse } from '../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    standalone: false
})
export class SignupComponent {
  condition: boolean | undefined = false;

  countryList: Array<{id:number,name:string}> = [];
  stateList: Array<{ state_id: number, state_name: string, country_id: string }> = [];
  genderList: Array<{genderLabel:string,GenderVal:string}> = [
    { genderLabel: "Male", GenderVal: "M" },
    { genderLabel: "Female", GenderVal: "F" },
    { genderLabel: "Other", GenderVal: "O" },
  ];
  userData = {
    email: null,
    password: null,
    name: null,
    phone: null,
    country: 0,
    state: null,
    city: null,
    firstName: null,
    lastName: null,
    gender: null,
    address: null,
    address2: null,
   dob: null,
  }
  profileImage: File | undefined = undefined;
  FullName: string = "";
  checkboxval: any = [];

  message: string | any;
  ipAddress: any;
  usersDataFromDatabase: any;

  constructor(private fBuilder: FormBuilder, private router: Router, private user: UserService, private alert: AlertService, private appLoader: AppComponent, private service: HttpLoginService) {
  }

  ngOnInit(): void {

    this.getCountryList();
    this.updateName();
  }

  updateName() {
    this.FullName = (!(this.userData.firstName && this.userData.lastName)) ? "N/A" : this.userData.firstName + " " + this.userData.lastName;
  }

  onFileSelected(file: File | undefined) {
    // console.log(this.productImage);
    this.profileImage = file;
    console.log('Selected file:', this.profileImage);

  }

  postData(formData: NgForm): void {
    this.appLoader.isLoading = true;
    let formDatas = new FormData();
    formDatas.append('user', JSON.stringify(this.userData));
    if (this.profileImage) formDatas.append('image', this.profileImage, this.profileImage.name);
    this.service.getDataAndSetList<baseResponse>(() => this.service.GetApiResponse<baseResponse, FormData>('/users/signup', formDatas, PostType.POST), (response) => {
      this.alert.showAlert(response.message, AlertType.Success);
      setTimeout(() => {
        formData.reset();
        this.appLoader.isLoading = false;
        this.router.navigate(["user/login"]);
      }, 3000);
    });
  }

  redirectUser(redirectTo: string) {
    this.router.navigateByUrl('/' + redirectTo);
  }

  checkboxEventHandler(event: any) {
    const lang = this.checkboxval;
    if (event.target.checked) {
      lang.push(event.target.value);
    } else {
      const index = lang.findIndex((x: any) => x === event.target.value);
      lang.splice(index, 1);
    }
  }

  getCountryList() {
    this.service.getDataAndSetList<Array<{ id: number, name: string }>>(() => this.service.GetApiResponse<Array<{ id: number, name: string }>, undefined>('/list/countrylist', undefined, PostType.GET), (response) => {
      this.userData.country = response[0].id;
      this.getStateList(this.userData.country);
      this.countryList = response;
    });
  }
  getStateList(id: number) {
    this.service.getDataAndSetList<Array<{ state_id: number, state_name: string, country_id: string }>>(() => this.service.GetApiResponse<Array<{ state_id: number, state_name: string, country_id: string }>, number>('/list/statelist', id, PostType.GET), (response) => {
      this.userData.state = response[0].state_id;
      this.stateList = response;
    });
  }
}
