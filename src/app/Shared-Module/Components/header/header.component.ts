import { ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { CspNonceService } from '../../Shared-Services/Security-Services/cspnounce.Service';
import { SharedService } from '../../Shared-Services/shared.Service';
import { debounceTime, distinctUntilChanged, filter, take } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: false
})
export class HeaderComponent {
  @Input() isUser: boolean = false;
  title = 'CartSystem';
  user = 0;
  isUserAdmin = 0;
  // userRole = localStorage.getItem('role');
  userRole:string;
  message: any | undefined;
  responseCountBill:number=0;
  responseCountCart:number=0;
  responseCountCheckout:number=0;
  protected cspPolicy: string = "default-src 'self'; font-src 'self' https://fonts.gstatic.com";
  protected cspNonce: string | undefined;
  constructor(
    private router: Router,
    private cspNonceService: CspNonceService,
    private sharedService: SharedService,
    private cdr:ChangeDetectorRef
  ) {}
  isMobileView: boolean = false;
  @HostListener('window:resize', [])
  onResize() {
    this.checkWindowSize();
  }

  // Check if window size is below 768px (mobile)
  checkWindowSize() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    this.isMobileView = window.innerWidth < 989;
    }
  }

  ngOnInit(): void {
    this.checkWindowSize();
    this.userRole = this.sharedService.getUserInfo()?.role;
    if (this.sharedService.getUserInfo()?.role == 'admin') {
      this.isUserAdmin = 1;
    } else {
    }
    this.user = 1;
    this.isUser = true;
    this.getCount();

    // this.router.events.pipe(filter(event => event instanceof NavigationEnd),debounceTime(300),distinctUntilChanged(),take(1)).subscribe(() => {
    //  return this.getCount();
    // });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        return this.getCount();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        return this.getCount();
      }
    });
    
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   take(0)
    // ).subscribe(() => {
    //   return this.getCount(); // Call the API after debounce
    // });
  }

  getCount():void{
    this.sharedService.getUserCount().then(result => {
      if (typeof result === 'number') {
        this.responseCountBill=result;
        this.cdr.detectChanges();
        console.log('User count:', result);
      } else if (typeof result === 'object' && result !== null) {
        // Handle the case where the result is an object with Checkout, Cart, Bill
        this.responseCountBill=result.Bill;
        this.responseCountCart=result.Cart;
        this.responseCountCheckout=result.Checkout;
        this.cdr.detectChanges();
      }
    });
  }

  redirectUser(redirectTo: string) {
    this.router.navigateByUrl('/' + redirectTo);
  }

  logoutUser() {
    this.sharedService.logout();
  }

  getUserName(): string {
    return (
      "<span style='font-family: cursive;'>" +
       this.sharedService.getUserInfo()?.userName +
      '</span>'
    );
  }
}
