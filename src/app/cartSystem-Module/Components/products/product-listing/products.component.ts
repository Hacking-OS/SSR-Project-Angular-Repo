import { HttpCartService } from './../../../Http-Services/cart.HttpService';
import { Component, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AlertType,
} from '../../../../Shared-Module/Alert-Services/alert.AlertService';
import { baseResponse } from '../../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';
import { CategoriesList } from '../../Schemas/Interfaces/category-list.Interface';
import { addToCartParams, ProductList } from '../../Schemas/Interfaces/product-list.Interface';
import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../Shared-Module/Alert-Services/notification/notification.AlertService';
import { PostType } from '../../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { SharedService } from '../../../../Shared-Module/Shared-Services/shared.Service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    standalone: false
})
export class ProductsComponent {
  condition: boolean | undefined = false;
  catDropdown: any | undefined;

  // @Output() newItemEvent = new EventEmitter<string>();
  // @ViewChild('navbar') navbar!: ElementRef;
  productStatus = signal<Array<boolean | null>>([]);
  baseUrl = environment.baseUrl;
  userData = {
    catname: '',
    catId: 0,
    catnamenew: '',
    name: '',
    catID: 0,
    description: '',
    price: 0,
    ProductId: 0,
    name2: '',
    catID2: 0,
    description2: '',
    price2: 0,
    ProductId2: 0,
  };

  checkboxval: any = [];
  isUserSeeGrid: boolean = false;
  message: string | any;
  ipAddress: any;
  usersDataFromDatabase: any;

  userRole:string;
  productName: string | any;
  productImage: any;
  alerts$;
  updateImage: any;
  // productImage: File | null = null;
  constructor(
    private router: Router,
    private alertService: AlertService,
    private notificationService: NotificationService,
    private httpCartService:HttpCartService,
    private sharedService:SharedService
  ) {
    this.userRole = this.sharedService.getUserInfo()?.role;
    this.alerts$ = this.notificationService.alerts$;
  }


  ngOnInit(): void {
    // Example of adding a notification
    // this.notificationService.addAlert({type: 'success', message: 'Bill has been successfully processed!'});
    this.getProducts();
    this.onClickChange();
  }

  // Example method to clear alerts
  clearAlerts() {
    this.notificationService.clearAlerts();
  }

  onClickChange() {
    this.isUserSeeGrid = !this.isUserSeeGrid;
  }

  changeInput(userId: number, status: number) {
    let newStatus = 0;
    if (status == 1) {
      newStatus = 0;
    } else {
      newStatus = 1;
    }
    let getIndex = this.usersDataFromDatabase.find((x: any) => x.id === userId);
    this.productStatus.update((values) => {
      let index = this.usersDataFromDatabase.findIndex((x: any) => x.id === userId);
      let newValues = [...values];
      newValues[index] = newStatus === 1 ? true : false;
      return newValues;
    });

    this.httpCartService.getDataAndSetList(()=> this.httpCartService.GetApiResponse<baseResponse,{userInput:number,status:number}>('/product/updateStatus',{userInput:userId,status:newStatus},PostType.PATCH),(response)=>{
      this.alertService.showAlertPopup(response.message, "Success!" ,AlertType.Success);
      this.getProducts();
    });
  }

  display = 'none';
  productData: any;
  openModal(
    CatUpdate: number,
    productName: string,
    productDescription: string,
    productPrice: string,
    categoryId: number
  ) {
    // ,person.name,person.description,person.price
    this.display = 'block';
    this.productData = {
      ProductId: CatUpdate,
      productName: productName,
      productDescription: productDescription,
      productPrice: productPrice,
      categoryId: categoryId,
    };
    this.userData.catID2 = this.productData.categoryId;
    this.userData.ProductId2 = this.productData.ProductId;
    this.userData.price2 = this.productData.productPrice;
    this.userData.name2 = this.productData.productName;
    this.userData.description2 = this.productData.productDescription;
  }
  onCloseHandled() {
    this.display = 'none';
  }

  redirectUser(redirectTo: string) {
    this.router.navigateByUrl('/' + redirectTo);
  }

  onFileSelectedUpdate(event: any, updateImage: boolean, userId: number) {
    if (event.target.files && event.target.files.length > 0) {
      if (updateImage) {
        // console.log("userId            "+userId);
        // return;
        this.productImage = event.target.files[0];
        const formData = new FormData();
        formData.append('image', this.productImage, this.productImage.name);
        formData.append('productData', JSON.stringify({ userId: userId }));
        formData.forEach((value, key) => {
          console.log(key + ': ' + value);
        });
        // /product/updateImage
        this.httpCartService.getDataAndSetList(()=> this.httpCartService.GetApiResponse<baseResponse,FormData>('/product/updateImage',formData,PostType.POST),(response)=>{

          this.alertService.showAlertPopup(response.message, "Success!" ,AlertType.Success);
          this.getProducts();

        });
        console.log('Selected uploading:', this.productImage);
      }
    }
  }
  onFileSelected(event: any) {
    console.log(this.productImage);
    this.productImage = event.target.files[0];
    console.log('Selected file:', this.productImage);
  }

  UpdateProduct(productId: number, FromData: NgForm) {
    this.userData.ProductId = productId;
    this.httpCartService.getDataAndSetList(()=> this.httpCartService.GetApiResponse<baseResponse,{userInput:object}>('/product/update',{userInput:this.userData},PostType.PATCH),(response)=>{
      this.alertService.showAlertPopup(response.message, "Success!" ,AlertType.Success);
      FromData.reset();
      this.getProducts();
    });
  }


  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/noImage.png'; // Fallback image
  }


  productDelete(ProductId: any) {
    this.httpCartService.getDataAndSetList(()=> this.httpCartService.GetApiResponse<baseResponse,number>('/product/delete',ProductId,PostType.DELETE),(response)=>{
      this.alertService.showAlertPopup(response.message, "Success!" ,AlertType.Success);
      this.getProducts();
    });
  }

  addToCart(productPrice: number, productId: number) {
  let params:addToCartParams = {
    userId: Number(this.sharedService.getUserInfo()?.userId),
    productPrice: productPrice,
    productId: productId
  }

    this.httpCartService.getDataAndSetList<baseResponse>(()=>this.httpCartService.GetApiResponse<baseResponse,addToCartParams>("/product/addToCart",params,PostType.POST),(response)=>{
      this.message = response.message;
      this.alertService.showAlert(this.message, AlertType.Success);
      this.timeOutLoading();
    });
  }

  checkboxEventHandler(event: any) {
    const lang = this.checkboxval;
    if (event.target.checked) {
      lang.push(event.target.value);
    } else {
      const index = lang.findIndex((x: any) => x === event.target.value);
      lang.splice(index, 1);
    }
  }

  getMessageClass() {
    if(!this.message) {
      return;
     }
    if (this.message === 'Updated To Cart successfully !') {
      this.alertService.showAlert(this.message, AlertType.Info);
      return 'alert alert-info';
    } else if (
      this.message === 'Added To Cart successfully !' ||
      'Product registered successfully !'
    ) {
      this.alertService.showAlert(this.message, AlertType.Success);
      return 'alert alert-success';
    } else {
      return '';
    }
  }

  getProducts() {

    this.httpCartService.getDataAndSetList<CategoriesList>(()=>this.httpCartService.GetApiResponse<CategoriesList,null>("/category/get",null,PostType.GET),(response)=>{

          console.log(response);
          this.catDropdown = response.categories;
          this.userData.catID = this.catDropdown ? this.catDropdown[0].id : 0;

      });

    if (this.userRole === 'user') {
      this.httpCartService.getDataAndSetList<Array<ProductList>>(()=>this.httpCartService.GetApiResponse<Array<ProductList>,null>("/product/get",null,PostType.GET),(response)=>{

            this.usersDataFromDatabase = response;
            this.productStatus.update(() => []);
            this.productStatus.update((values) => {
              // find the index of the user in the array
              let newValues = [...values];
              for (var i = 0; i < this.usersDataFromDatabase?.length; i++) {
                // set the value at the corresponding index based on the status property
                newValues[i] = this.usersDataFromDatabase[i].status === 1 ? true : false;
              }
              return newValues;
            });

        });
    } else {

      this.httpCartService.getDataAndSetList<Array<ProductList>>(()=>this.httpCartService.GetApiResponse<Array<ProductList>,null>("/product/get",null,PostType.GET),(response)=>{

        this.usersDataFromDatabase = response;
        this.productStatus.update(() => []);
        this.productStatus.update((values) => {
          let newValues = [...values];
          for (var i = 0; i < this.usersDataFromDatabase?.length; i++) {
            newValues[i] = this.usersDataFromDatabase[i].status === 1 ? true : false;
          }
          return newValues;
        });

      });
    }
  }

  timeOutLoading() {
    setTimeout(() => {}, 2300);
  }
  redirect() {
    this.router.navigate(['/cartSystem/productAdd']);
  }


  redirectTo(redirectTo: string, queryParams?: number): void {
    if (queryParams) {
      this.router.navigate([redirectTo], { queryParams: { id: queryParams } });
    } else {
      this.router.navigate([redirectTo]);
    }
  }
}
