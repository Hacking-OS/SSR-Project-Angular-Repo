import { DecryptService } from './Security-Services/decrypt.Service';
import { inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { SharedCoreService } from './shared-core.Service';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../Alert-Services/alert.AlertService';
import { HttpMainService } from '../Http-Services/main.HttpService';
import { SharedUserDetailsDto, SharedUserSessionDetailsDto } from './Schemas/Interfaces/shared.Interface';
import { EndpointBase } from './Token-Services/API-basePoint.TokenService';


// @Injectable()
@Injectable({
  providedIn: 'root',
  // providers: [SharedCoreService]
})
export class SharedService {
  // constructor(private userCount: SharedCoreService) { }
  private httpSharedCoreService: SharedCoreService;
  // private httpSharedCoreService = inject(SharedCoreService);
  constructor(private http: HttpClient, private injector: Injector, private router: Router,  private alert: AlertService,private decryptService:DecryptService) {
    const endpointBase = this.injector.get(EndpointBase);
    this.httpSharedCoreService = new SharedCoreService(this.http,this.router, this.alert,endpointBase,this.decryptService);
  }
  async getUserCount(): Promise<{Checkout: number;Cart: number;Bill: number;} | number> {
    return await this.httpSharedCoreService.getUserCount();
  }

  logout() {
    this.httpSharedCoreService.logoutUser();
  }

  getRandomString(length?: number): string {
    return this.httpSharedCoreService.createRandomString(length);
  }


  getCsrfToken(): string | null {
    return this.httpSharedCoreService.getCookie('XSRF-TOKEN');
  }

    getUserInfo():SharedUserDetailsDto {
      return this.httpSharedCoreService.getUserInfo();
    }

    getUserSessionInfo():SharedUserSessionDetailsDto {
      return this.httpSharedCoreService.getUserSessionInfo();
    }

    setUserDetails(data:string) :void {
      this.httpSharedCoreService.setUserDetails(data);
    }
}
