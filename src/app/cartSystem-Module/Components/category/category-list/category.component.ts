import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { categoryList, subCategoryList, CategoriesList } from '../../Schemas/Interfaces/category-list.Interface';
import { HttpCartService } from '../../../Http-Services/cart.HttpService';
import { PostType } from '../../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { SharedService } from '../../../../Shared-Module/Shared-Services/shared.Service';
import { NgForm } from '@angular/forms';
import { baseResponse } from '../../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';


@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css'],
    standalone: false
})
export class CategoryComponent {
  condition:boolean|undefined=false
  isSubCat:boolean|undefined=false;

userData={
  catname:"",
  catId:0,
  subCatId:0,
  catnamenew:"",
  CurrentCatName:""
  }

  checkboxval:any=[];

  message: string | any;
  ipAddress: any;
  categoryList:categoryList[]=[];
  subCategoryList:subCategoryList[]=[];
  userRole:string;
  constructor(private sharedService:SharedService,private router: Router,private cartService:HttpCartService) {
    this.userRole = this.sharedService.getUserInfo()?.role;
  }


  ngOnInit(): void {
    this.getUserCategories();
  }

 display = "none";
 getCatId:any;
openModal(catId:number,CatName:string,catOtherId?:number,isSubCat?:boolean) {
    this.display = "block";
    this.userData.catId=catOtherId?catOtherId:0;
    this.getCatId=catId;
    this.isSubCat=isSubCat;
    this.userData.CurrentCatName=CatName;
  }
  onCloseHandled() {
    this.display = "none";
  }


  redirectUser(redirectTo:string){
    this.router.navigateByUrl("/"+redirectTo);
  }

  checkboxEventHandler(event: any) {
    const lang = this.checkboxval;
    if (event.target.checked) {
      lang.push(event.target.value);
    } else {
      const index = lang.findIndex((x: any) => x === event.target.value);
      lang.splice(index,1);
    }
  }

  UpdateCategory(catId:number,updateCategoryForm:NgForm){
    if(updateCategoryForm.invalid) return;
  //   this.Category.updateCategoryById<baseResponse>(catId,localStorage.getItem("token"),this.userData.catnamenew,this.isSubCat,this.userData.catId).subscribe({next:(data:baseResponse)=>{
  //   this.message=data.message;
  //   this.display="none";
  //   this.getUserCategories();
  //   updateCategoryForm.reset();
  //  },error:(error:HttpErrorResponse)=>{
  //   this.message=error.error.message;
  //  }});
  }

  getUserCategories():void {
    if(this.userRole==='user'){
      this.cartService.getDataAndSetList<CategoriesList>(()=>this.cartService.GetApiResponse<CategoriesList,null>('/category/getUserCategory',null,PostType.GET),(response:CategoriesList)=>{
       this.categoryList=response.categories;
       this.subCategoryList=response.subCategories;
     });
     }else{
       this.cartService.getDataAndSetList<CategoriesList>(()=>this.cartService.GetApiResponse<CategoriesList,null>('/category/get',null,PostType.GET),(response:CategoriesList)=>{
        this.categoryList=response.categories;
        this.subCategoryList=response.subCategories;
       });
     }
  }
}
