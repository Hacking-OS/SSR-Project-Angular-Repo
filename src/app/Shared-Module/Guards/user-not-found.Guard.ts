import { SharedService } from './../Shared-Services/shared.Service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpMainService } from '../Http-Services/main.HttpService';
import { PostType } from '../Shared-Services/Schemas/Enums/responseType.Enum';

@Injectable({
  providedIn: 'root'
})
export class UserNotFoundGuard {
  constructor(private router: Router,private mainService:HttpMainService,private sharedService:SharedService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.mainService.getDataAndSetList<{message:string}>(()=>this.mainService.GetApiResponse<{message:string},undefined>('/test/check',undefined,PostType.GET),(response)=>{});
    if (this.sharedService.getUserInfo()?.role === null || this.sharedService.getUserInfo()?.role === undefined) {
      if (this.sharedService.getUserSessionInfo()?.access_token === null || this.sharedService.getUserSessionInfo()?.access_token === undefined) {
        return true;
      }
    }
    return false;
  }
}
