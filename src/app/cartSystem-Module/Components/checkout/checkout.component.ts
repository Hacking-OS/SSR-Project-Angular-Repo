import { Component } from '@angular/core'
import { NgForm } from '@angular/forms'
import { PostType } from '../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum'
import { SharedService } from '../../../Shared-Module/Shared-Services/shared.Service'
import { HttpCartService } from '../../Http-Services/cart.HttpService'
import { CheckoutList } from '../Schemas/Interfaces/checkout-list.Interface'
import { ICheckout_Request } from '../Schemas/Models/checkout.Model'

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css'],
    standalone: false
})
export class CheckoutComponent {
  userCard = {
    cardNumber: '',
    ccv: '',
    expMonth: '',
    expYear: '',
  }

  message: any | undefined
  userCartData: any | undefined
  state: string | undefined
  constructor(
    private httpCartService: HttpCartService,
    private sharedService: SharedService,
  ) {
    this.getCheckoutData();
  }
  submitPayment(PaymentValues: NgForm) {
    console.log(PaymentValues.form.value);
        this.httpCartService.getDataAndSetList<Blob>(()=>this.httpCartService.GetApiResponse<Blob,ICheckout_Request>('/bill/GenerateReport',{ id: this.sharedService.getUserInfo()?.userId.toString(), cardDetails: PaymentValues.form.value, paymentType: this.state, productInfo: this.userCartData, role: this.sharedService.getUserInfo()?.role},PostType.POST,"blob"),(response)=>{
          var file = new Blob([response], { type: 'application/pdf' });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL,'_blank');
          this.getCheckoutData();
          this.sharedService.getUserCount();
        });
  }

  check(currentvalue: string) :void {
    this.state = currentvalue;
    if (this.state === "CashOnDelivery") {
      this.httpCartService.getDataAndSetList<Blob>(()=>this.httpCartService.GetApiResponse<Blob,ICheckout_Request>('/bill/GenerateReport',{ id: this.sharedService.getUserInfo()?.userId.toString(), cardDetails: 0, paymentType: this.state, productInfo: this.userCartData, role: this.sharedService.getUserInfo()?.role},PostType.POST,"blob"),(response)=>{
        var file = new Blob([response], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL,'_blank');
        this.getCheckoutData();
        this.sharedService.getUserCount();
      });
    }
  }

  getCheckoutData() {
    this.httpCartService.getDataAndSetList<Array<CheckoutList>>(() => this.httpCartService.GetApiResponse<Array<CheckoutList>,number>('/checkout/get',Number(this.sharedService.getUserInfo()?.userId),PostType.GET),(response)=>{
      this.userCartData = response;
     });
  }

  getMessageClass(status: number) {
    if (status === 1) {
      return 'alert alert-success';
    } else {
      return 'alert alert-warning';
    }
  }
}
