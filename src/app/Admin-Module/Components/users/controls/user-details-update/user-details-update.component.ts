import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { DecryptService } from '../../../../../Shared-Module/Shared-Services/Security-Services/decrypt.Service';
import { HttpAdminService } from '../../../../Http-Services/admin.HttpService';
import { userParams } from '../../../../Schemas/Interfaces/userParams.Interface';
import { UserDetailsParams } from '../../../Schemas/Interfaces/admin-Update-User.interface';

@Component({
    selector: 'app-user-details-update',
    templateUrl: './user-details-update.component.html',
    styleUrl: './user-details-update.component.css',
    standalone: false
})
export class UserDetailsUpdateComponent {
  params: userParams | undefined;
  protected userInfo: Array<UserDetailsParams> = [];
  getUserInfo: string | undefined;
  getAdminStateInfo: boolean | undefined;
  getAdminRoleInfo: object | undefined;
  baseUrl = environment.baseUrl;
  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private decryptService: DecryptService, private service: HttpAdminService, private datePipe: DatePipe) {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.getUserInfo = params['editModeAdmin'];
    //   this.getAdminStateInfo = params['stateUpdate'];
    //   this.getAdminRoleInfo = JSON.parse(this.decryptService.decrypt(params['role']));
    // });
    const navigation = this._router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state["data"]) {
      this.params = navigation.extras.state["data"];
    } else {
      // this.params=new userParams();
      // if (this.getUserInfo && this.getAdminStateInfo && this.getAdminRoleInfo) {
      //   this.params = JSON.parse(this.decryptService.decrypt(this.getUserInfo));
      // } else {
      this._router.navigate(['admin/dashboard']);
      // }
    }
    console.log(this.params);
  }

  async ngOnInit(): Promise<void> {
   let params = await this.getUserInfoAndBillDetails();
   console.log("###################Params");
   console.log(params);
   this.userInfo = params || [];
  }

  async getUserInfoAndBillDetails(): Promise<any> {
    let query = "Select * from users where id = " + this.params?.userID;
    return await this.service.getDataAndSetList<Array<UserDetailsParams>>(() => this.service.GetApiResponse<Array<UserDetailsParams>, object>('/users/getresults', { query: query }), (response) => { });
  }




  getInfo(): string {
    return `User <span class="text-primary">${this.userInfo[0]?.name}</span>  logged in at <span class="text-primary"> ${this.datePipe.transform(new Date(this.userInfo[0]?.loggedIn), 'dd/MM/yyyy hh:mm:ss a')}</span>  with role  <span class="text-primary">${this.userInfo[0]?.role}</span>`;
  }

  ngOnDestroy(): void {
    this._router.navigate(['admin/dashboard'], { state: {} });
  }
}
