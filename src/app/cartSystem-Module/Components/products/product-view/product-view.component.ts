import { HttpCartService } from './../../../Http-Services/cart.HttpService';
import { Component } from '@angular/core';
import { ProductService } from '../../../Services/product.Service';
import { ActivatedRoute } from '@angular/router';
import { baseResponse } from '../../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';
import { DecryptService } from '../../../../Shared-Module/Shared-Services/Security-Services/decrypt.Service';
import { ProductDetailsParams } from '../../Schemas/Interfaces/view-product.interface';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PostType } from '../../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';

@Component({
    selector: 'app-product-view',
    templateUrl: './product-view.component.html',
    styleUrl: './product-view.component.css',
    standalone: false
})
export class ProductViewComponent {
  productID: number = 0;
  productParams: any;
  baseUrl = environment.baseUrl;
  constructor(public productService: ProductService, private activatedRoute: ActivatedRoute, private decryptService: DecryptService,private sanitize:DomSanitizer,private httpCartService:HttpCartService) { }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.productID = params['id'];
      if (this.productID) {
        this.getProductsById();
      }
    });
  }

  getProductsById(): void {
    this.httpCartService.getDataAndSetList<baseResponse>(()=>this.httpCartService.GetApiResponse<baseResponse,number>("/product/getProductsById",this.productID,PostType.GET),(response)=>{
      if (response.message) {
        let decryptData = this.decryptService.decrypt<ProductDetailsParams>(response.message);
        this.productParams = decryptData;
      }
    });
  }

  getClass(): string {
    if (this.productParams?.status == 1) {
      return 'btn btn-info';
    } else {
      return 'btn btn-warning';
    }
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/noImage.png'; // Fallback image
  }


  htmlPropertiesForProductView(lblfor:string,lblvalue:any): SafeHtml {
      return this.sanitize.bypassSecurityTrustHtml(`<span style="font-weight:bold">${lblfor}: </span>  <span>${lblvalue}</span>`) as SafeHtml;
  }
}
