import { SharedService } from './Shared-Module/Shared-Services/shared.Service';
import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core'
import { Router } from '@angular/router'
// import { CountService } from './Admin-Module/Services/count.Service';
import { CspNonceService } from './Shared-Module/Shared-Services/Security-Services/cspnounce.Service';
import { observeOn, asapScheduler, delay } from 'rxjs';
import { BusyPayload, BusyService } from './Shared-Module/Shared-Services/Interceptor-Services/busy.service';
import { LoadingService } from './Shared-Module/Shared-Services/Interceptor-Services/loading.service';
import { FormBuilder } from '@angular/forms';
import { LoggerService } from './Shared-Module/Shared-Services/Logging-Services/logging.Service';



export interface GridListItem_ApproveRejectEarlyReturnForm {
  isSelectedForPayment: boolean;
  strITSID: string;
  contNo: string;
  strFullName: string;
  strEmail: string;
  createdDate1: Date | null;
  chqNo: string;
  contributeMature: Date | null;
  paymentType: string;
  contributeAmount: number;
  bqhNumberHS: string;
  maturityInDays: number;
  wStatus: string;
  paymentStatus: string;
  earlyReason: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'CartSystem';
  user = 0;
  isUserAdmin = 0;
  isLoading: boolean = false;
  userRole;
  // protected cspPolicy: string = "default-src 'self'; font-src 'self' https://fonts.gstatic.com";
  protected cspPolicy: string = "default-src 'self'; font-src 'self' https://fonts.gstatic.com";
  // busy: boolean = false;, private count: CountService
  busy: boolean;
  protected cspNonce: string | undefined;
  constructor(private router: Router, private renderer: Renderer2, private cspNonceService: CspNonceService, private busyService: BusyService, public loadingService: LoadingService, private fb: FormBuilder,private logger:LoggerService, private cdr: ChangeDetectorRef , private sharedService:SharedService) {
    this.userRole = this.sharedService.getUserInfo()?.role;

    // this.logger.info("Logger State: ");
    this.logger.getTokenRefreshStatus().pipe(observeOn(asapScheduler)).subscribe((state) => {
      // this.logger.info("Refresh-Token State:    "+  state);
      this.cdr.detectChanges();
    });
    // busyService.busyState$.pipe(delay(0)).subscribe((bs) => (this.busy = bs.isBusy));
    // asapScheduler ensures this is async; remove this and look in console to see nasty error without this
    // ExpressionChangedAfterItHasBeenCheckedError
    // this.busyService.busyState$.subscribe((bs: BusyPayload) => (this.busy = bs.isBusy));
    this.busyService.busyState$.pipe(observeOn(asapScheduler)).subscribe((bs: BusyPayload) => (this.busy = bs.isBusy));
    // this.busyService.busyState$.pipe(observeOn(asapScheduler)).subscribe((bs: BusyPayload) => (this.busy = bs.isBusy));
    this.busy = false;
    const nonce = this.cspNonceService.generateNonce();
    this.cspPolicy = `script-src 'self' ${nonce}`;
    this.cspNonceService.generateNonce().then((nonce) => {
      this.cspNonce = nonce;
    });

  }

  redirectUser(redirectTo: string) {
    this.router.navigateByUrl('/' + redirectTo);
  }
}
