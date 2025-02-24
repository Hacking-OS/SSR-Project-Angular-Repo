import { Component } from '@angular/core';
import { HttpLoginService } from '../../Http-Services/login.HttpService';
import { baseResponse } from '../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';

@Component({
    selector: 'app-payment-integration',
    templateUrl: './payment-integration.component.html',
    styleUrl: './payment-integration.component.css',
    standalone: false
})
export class PaymentIntegrationComponent {
constructor(private loginService:HttpLoginService){}
  pay(){
    console.log("Payment Done");
    this.loginService.getDataAndSetList<baseResponse>(() => this.loginService.GetApiResponse<baseResponse, undefined>('/users/pay', undefined), (response: baseResponse) => {

    });
  }
}
