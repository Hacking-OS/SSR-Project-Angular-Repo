export interface CategoriesList {
 categories:categoryList[]
  subCategories:subCategoryList[]
}

export interface subCategoryList{
  id:number;
  categoryID:number;
  subCategoryName:string;
}
export interface categoryList{
  id:number;
  name:string;
}

