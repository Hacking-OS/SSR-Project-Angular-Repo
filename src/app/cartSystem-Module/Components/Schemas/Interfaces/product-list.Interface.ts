export interface ProductList {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
}

export interface addToCartParams {
  productPrice: number;
  productId: number;
  userId: number;
}
