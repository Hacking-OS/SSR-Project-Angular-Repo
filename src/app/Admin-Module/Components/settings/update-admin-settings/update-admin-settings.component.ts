import { Component } from '@angular/core';
import { PostType } from '../../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { EncryptService } from '../../../../Shared-Module/Shared-Services/Security-Services/encrypt.Service';
import { HttpAdminService } from '../../../Http-Services/admin.HttpService';
import { AdminUpdateRedirect } from '../../Schemas/Interfaces/adminRedirect.Interface';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { SharedService } from '../../../../Shared-Module/Shared-Services/shared.Service';
import { baseResponse } from '../../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';
import { AlertService, AlertType } from '../../../../Shared-Module/Alert-Services/alert.AlertService';

@Component({
    selector: 'app-update-admin-settings',
    templateUrl: './update-admin-settings.component.html',
    styleUrl: './update-admin-settings.component.css',
    standalone: false
})
export class UpdateAdminSettingsComponent {

  AdminviewRights:any|undefined;
  userAdmin:any|undefined;
  message:any|undefined;
  billDetails:any|undefined;
  baseUrl=environment.baseUrl;


  constructor(private adminService:HttpAdminService,private router:Router,private sharedService:SharedService,private alertService:AlertService){
  this.getAdminDetails();
}

changeInput(userId:number,status:boolean,userRole:string){
  if(userRole==='admin') return;
 let currentStatus = 0;
 if(status==true){
  currentStatus = 0;
 }else{
  currentStatus = 1;
 }

 let params = {
  id:userId,
  newStatus:currentStatus
 }
 this.adminService.getDataAndSetList<baseResponse>(()=>
  this.adminService.GetApiResponse('/users/update',params,PostType.PATCH),(response)=>{
   this.getAdminDetails();
    this.alertService.showAlert(response.message,AlertType.Success);
  });
//  this.user.changeUserStatus(userId,localStorage.getItem("token"),newStatus).subscribe((data:any)=>{
//    this.alertService.showAlert(data.message,AlertType.Success);
//  },(error:any)=>{

//  });

}

  getAdminDetails(){
    // /dashboard/details
    this.adminService.getDataAndSetList<any>(()=>this.adminService.GetApiResponse<any,null>('/users/get',null,PostType.GET),(response:any)=>{
      this.AdminviewRights=response;
      });

    this.adminService.getDataAndSetList<any>(()=>this.adminService.GetApiResponse<any,null>('/dashboard/admin-details',null,PostType.GET),(response:any)=>{
      this.billDetails=response;
      });
  }
   routeTo(userParams:AdminUpdateRedirect):void{
    const encryptedEditModeAdmin = EncryptService.encrypt(JSON.stringify(userParams));
    const encryptedRole = EncryptService.encrypt(JSON.stringify({
      userRole: "admin",
      updateUser: !userParams.isActive,
      isblockedAdminPermission: userParams.isActive,
      isAllowUserPermission: userParams.isActive
    }));
    //
    this.router.navigate(['/admin/controls/users'], {
      state: { data: userParams }
    });

  }

  getMessageClass(status:number,role:string):string {
    if (status === 1 && role === 'admin') {
      return 'badge bg-success p-2 m-1 text-white';
    } else{
      return (status === 1) ? 'badge bg-info p-2 m-1 text-white':'badge bg-warning p-2 m-1 text-white';
    }
  }

}
