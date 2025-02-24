import { HttpCartService } from './../../../Http-Services/cart.HttpService';
import { Component } from '@angular/core';
import { CartList } from '../../Schemas/Interfaces/cart-list.Interface';
import { AlertService, AlertType } from '../../../../Shared-Module/Alert-Services/alert.AlertService';
import { baseResponse } from '../../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';
import { PostType } from '../../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { environment } from "../../../../../environments/environment";
import { SharedService } from '../../../../Shared-Module/Shared-Services/shared.Service';
@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
    standalone: false
})
export class CartComponent {
  message: any | undefined;
  userCartData: any | undefined;
  userCartData2: any | undefined;
  protected enviroment = environment;
  userId:number;
  constructor(
    private alertService: AlertService,
    private httpCartService: HttpCartService,
    private sharedService:SharedService
  ) {
    this.userId = this.sharedService.getUserInfo()?.userId;
  }
   ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getUserCart();

   }

  removeFromCart(cartId: any) {
    this.httpCartService.getDataAndSetList<{message :string}>(() => this.httpCartService.GetApiResponse<{message :string},{ id:number}>('/cart/remove',{ id:cartId },PostType.POST),(response)=>{
      this.alertService.showAlert(response.message, AlertType.Warning);
      this.getUserCart();
     });
  }

  checkoutUser() {
    // /cart/checkout
    this.httpCartService.getDataAndSetList<baseResponse>(() => this.httpCartService.GetApiResponse<baseResponse,{id:number}>('/cart/checkout',{id:Number(this.userId)},PostType.POST),(response)=>{
       this.alertService.showAlert(response.message,AlertType.Success);
     });
  }

  getUserCart() {
   this.httpCartService.getDataAndSetList<Array<CartList>>(() => this.httpCartService.GetApiResponse<Array<CartList>,number>('/cart/get',Number(this.userId),PostType.GET),(response)=>{
    this.userCartData = response;
   });
  }
}
