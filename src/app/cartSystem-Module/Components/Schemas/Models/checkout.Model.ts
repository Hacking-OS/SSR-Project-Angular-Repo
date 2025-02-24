export interface ICheckout_Request {
    id: string | null;  // Since localStorage.getItem() returns string | null
    cardDetails: number | Record<string,any>;
    paymentType: string;
    productInfo: any;   // You might want to replace `any` with a specific type
    role: string | null;
  }