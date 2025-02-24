import { DatePipe } from "@angular/common";
import { ElementRef, EventEmitter, Injectable, NgModule, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { Subject, tap } from "rxjs";
import moment from "moment";
import { popupRowParams } from "../Schemas/Models/popup-row.Model";
import { PopupParams, divControlProperties, getStringProperty, popupResponse } from "../Schemas/Models/popup.Model";

declare var bootstrap: any;
// @NgModule({})
@Injectable()
class PopupConditionsValidate {
  @ViewChildren('modelPopup, modelPopup2, modelPopup3') modalPopups!: QueryList<ElementRef>;
  popupData: PopupParams = new PopupParams();
  divControl: divControlProperties = new divControlProperties();
  private popupConditionSubject = new Subject<Readonly<Record<getStringProperty, popupResponse>>>();
  public getPopupConditions$ = this.popupConditionSubject.asObservable();
  private modalInstances: { [key: number]: any } = {};

  constructor(private _datePipe: DatePipe) { }

  conditions(CommandName: string, rowData: popupRowParams) {
    this.divControl.Div_Cheque = false;
    this.divControl.Div_Bank = false;
    this.divControl.Div_Collect = false;
    this.divControl.Div_Status = false;
    this.divControl.Div_OfflineRefNo = false;
    //#region Common fields for all cases
    this.popupData.contNo = rowData.contNo;
    this.popupData.Amount = rowData.contributeAmount;
    this.popupData.BQHNumber = "";
    this.popupData.strFullName = rowData.strFullName;
    this.popupData.contributeAmount = rowData.contributeAmount;
    this.popupData.paymentType = rowData.paymentType;
    this.popupData.bankName = rowData.bankName;
    this.popupData.branchName = rowData.branchName;
    this.popupData.lblPopChequeStatus = rowData.paymentStatus;
    this.popupData.chqNo = rowData.chqNo;
    this.popupData.rowObject = rowData;
    this.popupData.showModal = 1;
    this.getConditionProperties({ divControl: this.divControl, popupData: this.popupData });
    //#endregion
  }

  private getConditionProperties(prop: popupResponse) {
    const record: Readonly<Record<getStringProperty, popupResponse>> = {
      popupControls: {
        divControl: prop.divControl,
        popupData: prop.popupData
      }
    };
    this.popupConditionSubject.next(record);
  }

  parseDate(dateString: any): Date| null {
    var date = moment(dateString);
    if (date.isValid()) {
      return new Date(this._datePipe.transform(dateString, 'yyyy-MM-dd') as string);
    }
    return null;
  }

  // private
  public async setModalInstances(modalPopups: QueryList<ElementRef>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        modalPopups.forEach((element, index) => {
          // element.nativeElement.id
          const modalInstance = new bootstrap.Modal(element.nativeElement);
          this.modalInstances[index + 1] = modalInstance;
        });
        resolve();
      } catch (e) {
        reject();
      }
    });

  }

  public showModal(modalId: number): void {
    this.toggleModal(modalId, 'show');
  }
  
  public hideModal(modalId: number): void {
    this.toggleModal(modalId, 'hide');
  }

  private toggleModal(modalId: number, action: 'show' | 'hide'): void {
    const modal = this.modalInstances[modalId];
    if (modal) {
      modal[action]();
    } else {
      console.error(`Modal with ID '${modalId}' not found.`);
    }
  }

}

export { PopupConditionsValidate }
