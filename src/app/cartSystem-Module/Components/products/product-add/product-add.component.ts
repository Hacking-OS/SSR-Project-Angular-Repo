import { HttpCartService } from './../../../Http-Services/cart.HttpService';
import {
  Component,
  signal,
} from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { AlertService, AlertType } from '../../../../Shared-Module/Alert-Services/alert.AlertService'
import { baseResponse } from '../../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface'
import { categoryList, subCategoryList, CategoriesList } from '../../Schemas/Interfaces/category-list.Interface'
import { PostType } from '../../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { SharedService } from '../../../../Shared-Module/Shared-Services/shared.Service';


@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.css'],
    standalone: false
})
export class ProductAddComponent {
  condition: boolean | undefined = false;
  catDropdown:categoryList[]=[];
  subCatDropdown: subCategoryList[]=[];

  // @Output() newItemEvent = new EventEmitter<string>();
  // @ViewChild('navbar') navbar!: ElementRef;

  userData = {
    inventoryCount:'',
    catname: '',
    catId: 0,
    catnamenew: '',
    name: '',
    catID: 0,
    subCatID: 0,
    description: '',
    price: '',
    ProductId: 0,
    name2: '',
    catID2: 0,
    subCatID2: 0,
    description2: '',
    price2: '',
    ProductId2: 0,
  }

  checkboxval: any = []
  isUserSeeGrid: boolean = false
  message: string | any
  ipAddress: any
  usersDataFromDatabase: any
  productName: string| any;
  // productImage: any;
  productImage: File|undefined=undefined;
  updateImage: any;
  // productImage: File | null = null;
  userRole:string;
  constructor(private sharedService:SharedService,private router: Router,private httpCartService:HttpCartService,private alertService:AlertService) {
    this.userRole = this.sharedService.getUserInfo()?.role;
  }

  ngOnInit(): void {
    this.loadCat();
  }

  redirectUser(redirectTo: string) {
    this.router.navigateByUrl('/' + redirectTo)
  }

  onFileSelected(uploadingFile:File|undefined):void {
    console.log(this.productImage);
        this.productImage = uploadingFile;
        console.log('Selected file:', this.productImage);
  }

  postData(formDataInfo: NgForm): void {
  if (this.productImage) {
    const formData = new FormData();
    formData.append('image', this.productImage, this.productImage.name);
    formData.append('productData', JSON.stringify(this.userData));
    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
  });
    // return;
    this.httpCartService.getDataAndSetList(()=> this.httpCartService.GetApiResponse<baseResponse,FormData>('/product/add',formData,PostType.POST),(response)=>{
      this.alertService.showAlert(response.message,AlertType.Success);
      this.redirectUser("/cartSystem/product");
    });
      formDataInfo.reset();

  } else{
    const formData = new FormData();

    formData.append('image', "");
    formData.append('productData', JSON.stringify(this.userData));
    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
  });

    this.httpCartService.getDataAndSetList(()=> this.httpCartService.GetApiResponse<baseResponse,FormData>('/product/add',formData,PostType.POST),(response)=>{
      this.alertService.showAlert(response.message,AlertType.Success);
      this.redirectUser("/cartSystem/product");
    });

      formDataInfo.reset();
  }

  }





  getMessageClass() {
    if(!this.message) {
      return;
     }
    if (this.message === 'Updated To Cart successfully !') {
      this.alertService.showAlert(this.message, AlertType.Info)
      return 'alert alert-info'
    } else if (
      this.message === 'Added To Cart successfully !' ||
      'Product registered successfully !'
    ) {
      this.alertService.showAlert(this.message, AlertType.Success)
      return 'alert alert-success'
    } else {
      return ''
    }
  }



  loadSubCat(id:number):void{
    if(!id) return;
    this.httpCartService.getDataAndSetList<CategoriesList>(()=> this.httpCartService.GetApiResponse<CategoriesList,{catID:number}>('/category/getAllSubCategories',{catID:id},PostType.POST),(response)=>{
      this.subCatDropdown = response.subCategories;
      this.userData.subCatID = (this.subCatDropdown)?this.subCatDropdown[0].id:0;
    });
  }

  loadCat() : void {
    this.httpCartService.getDataAndSetList<CategoriesList>(()=> this.httpCartService.GetApiResponse<CategoriesList, null>('/category/get',null,PostType.GET),(response)=>{
      this.catDropdown = response.categories;
      this.userData.catID = (this.catDropdown)?this.catDropdown[0].id:0;
      this.loadSubCat(this.userData.catID);
    });
  }

  back(){
    this.router.navigate(['/cartSystem/product']);
  }
}
