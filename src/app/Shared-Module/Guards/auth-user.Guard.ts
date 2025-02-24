import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpMainService } from '../Http-Services/main.HttpService';
import { PostType } from '../Shared-Services/Schemas/Enums/responseType.Enum';
import { SharedService } from '../Shared-Services/shared.Service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserGuard {
  constructor(private router: Router,private mainService:HttpMainService,private sharedService:SharedService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.mainService.getDataAndSetList<{message:string}>(()=>this.mainService.GetApiResponse<{message:string},undefined>('/test/check',undefined,PostType.GET),(response)=>{});
    if (this.sharedService.getUserInfo()?.role === 'admin') {
      return true;
    } else {
      return false;
    }
  }
}

