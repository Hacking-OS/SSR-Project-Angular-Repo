import { popupRowParams } from "./popup-row.model";


class divControlProperties {
  Div_Cheque: boolean = false;
  Div_Bank: boolean = false;
  Div_Collect: boolean = false;
  Div_Status: boolean = false;
  Div_OfflineRefNo: boolean = false;
}

class PopupParams {
  contNo!: number;
  Amount!: string | number;
  BQHNumber!: string;
  strFullName!: string;
  contributeAmount!: string | number;
  paymentType!: string;
  bankName!: string;
  branchName!: string;
  lblPopChequeStatus!: string;
  chqNo!: string;

  lblPopChequeDate!: string | Date;

  lblChequeNo!: string;
  lblChequeDate!: string;
  description!: string;
  showModal!: number;
  title!: string;
  lblPopBQHNumber!: string;
  txtRefNo!: string;
  lblPopTransactionDate!: string | Date;
  rowObject:popupRowParams = new popupRowParams();
}

type getStringProperty = "popupControls";

  // popupResponseProperty:Record<getStringProperty, { divControl: divControlProperties, popupData: PopupParams }>
interface popupResponse {
    divControl: Readonly<divControlProperties>;
    popupData: Readonly<PopupParams>;
}
export { divControlProperties, PopupParams,getStringProperty,popupResponse }
