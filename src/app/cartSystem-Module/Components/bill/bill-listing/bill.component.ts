import { Component, OnInit } from '@angular/core';
import { BillList } from '../../Schemas/Interfaces/bill-list.Interface';
import { baseResponse } from '../../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';
import { AlertService, AlertType } from '../../../../Shared-Module/Alert-Services/alert.AlertService';
import { HttpCartService } from '../../../Http-Services/cart.HttpService';
import { PostType } from '../../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { SharedService } from '../../../../Shared-Module/Shared-Services/shared.Service';

@Component({
    selector: 'app-bill',
    templateUrl: './bill.component.html',
    styleUrls: ['./bill.component.css'],
    standalone: false
})
export class BillComponent implements OnInit {
  message:any|undefined;
  show:any;
displayedColumns: string[] = ['uuid', 'paymentMethod', 'email', 'name', 'total', 'phone', 'actions', 'details'];
  userRole:string;
  userId:number;
  constructor(private alert:AlertService,private cartService:HttpCartService,private sharedService:SharedService){
    this.userRole = this.sharedService.getUserInfo()?.role;
    this.userId = this.sharedService.getUserInfo()?.userId;
    }


    ngOnInit(): void {
      this.getBillForUsers();
    }

    deleteBill(uuid:string){
      this.cartService.getDataAndSetList<baseResponse>(()=>this.cartService.GetApiResponse<baseResponse,string>('/bill/delete',uuid,PostType.DELETE),(response:baseResponse)=>{
        this.alert.showAlert(response.message,AlertType.Success);
        });
    }

    getPdf(id:string){
      this.cartService.getDataAndSetList<Blob>(()=>this.cartService.GetApiResponse<Blob,{id:string,userId:number}>('/bill/getPdf',{id:id , userId:Number(this.userId)},PostType.POST,'blob','body'),(response:Blob)=>{
      var file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
 });
 }

    getClassForPaymentType(paymentTypeName:string):string{
      return (paymentTypeName==="CardPayMent")?"badge bg-success p-2 m-1":"badge bg-info p-2 m-1";
    }

      getBillForUsers(){

      if(this.userRole==="user"){

      this.cartService.getDataAndSetList<Array<BillList>>(()=>this.cartService.GetApiResponse<Array<BillList>,number>('/bill/getBillsUsers',Number(this.userId),PostType.GET),(response:Array<BillList>)=>{
        
      this.show=response;

      });
    } else {

      this.cartService.getDataAndSetList<Array<BillList>>(()=>this.cartService.GetApiResponse<Array<BillList>,null>('/bill/getBills',null,PostType.GET),(response:Array<BillList>)=>{

      this.show=response;

        });
      }
   }
}
