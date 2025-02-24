import { Injectable } from '@angular/core';
import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ErrorCaption, ErrorDetail } from './Schemas/Enums/ErrorMessage.Enum';

@Injectable()
export class Utilities {
  // public static cookies = {
  //   getItem: (sKey: string): string | null => {
  //     return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
  //   },
  //   setItem: (sKey: string, sValue: string, vEnd?: string | number | Date, sPath?: string, sDomain?: string, bSecure?: boolean): boolean => {
  //     if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
  //       return false;
  //     }

  //     let sExpires = '';

  //     if (vEnd) {
  //       switch (vEnd.constructor) {
  //         case Number:
  //           sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
  //           break;
  //         case String:
  //           sExpires = '; expires=' + vEnd;
  //           break;
  //         case Date:
  //           sExpires = '; expires=' + (vEnd as Date).toUTCString();
  //           break;
  //       }
  //     }

  //     document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
  //     return true;
  //   },
  //   removeItem: (sKey: string, sPath?: string, sDomain?: string): boolean => {
  //     if (!sKey) {
  //       return false;
  //     }
  //     document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
  //     return true;
  //   },
  //   hasItem: (sKey: string): boolean => {
  //     return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
  //   },
  //   keys: (): string[] => {
  //     const aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
  //     for (let nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
  //     return aKeys;
  //   }
  // };

  public static getHttpResponseMessages(data: HttpResponseBase): string[] {
    const responses: string[] = [];

    if (data instanceof HttpResponseBase) {

      if (this.checkNoNetwork(data)) {
        responses.push(`${ErrorCaption.NoNetwork}${ErrorCaption.Seperator} ${ErrorDetail.NoNetwork}`);
        // responses.push(`${this.noNetworkMessageCaption}${ErrorCaption.Seperator} ${this.noNetworkMessageDetail}`);
      }
      else if (this.checkXSS(data)) {
        responses.push(`${ErrorCaption.CrossSiteError}${ErrorCaption.Seperator} ${ErrorDetail.CrossSiteError}`);
      }
      else {
        const responseObject = this.getResponseBody(data);

        if (responseObject && (typeof responseObject === 'object' || responseObject instanceof Object)) {

          for (const key in responseObject) {
            if (key) {
              responses.push(`${key}${ErrorCaption.Seperator} ${responseObject[key]}`);
            } else if (responseObject[key]) {
              responses.push(responseObject[key].toString());
            }
          }
        }
      }

      if (!responses.length) {
        if ((data as any).body) {
          responses.push(`body: ${(data as any).body}`);
        }

        if ((data as any).error) {
          responses.push(`error: ${(data as any).error}`);
        }
      }
    }

    if (!responses.length) {
      if (this.getResponseBody(data)) {
        responses.push(this.getResponseBody(data).toString());
      } else {
        responses.push(data.toString());
      }
    }

    if (this.checkAccessDenied(data)) {
      responses.splice(0, 0, `${ErrorCaption.AccessDenied}${ErrorCaption.Seperator} ${ErrorDetail.AccessDenied}`);
    }

    if (this.checkNotFound(data)) {
      let message = `${ErrorCaption.NotFound}${ErrorCaption.Seperator} ${ErrorDetail.NotFound}`;
      if (data.url) {
        message += `. ${data.url}`;
      }

      responses.splice(0, 0, message);
    }

    return responses;
  }

  public static getHttpResponseMessage(data: HttpResponseBase | any): string {
    const httpMessage =
      Utilities.findHttpResponseMessage(ErrorCaption.NoNetwork, data) ||
      Utilities.findHttpResponseMessage(ErrorCaption.NotFound, data) ||
      Utilities.findHttpResponseMessage('error_description', data) ||
      Utilities.findHttpResponseMessage('error', data) ||
      Utilities.getHttpResponseMessages(data).join();

    return httpMessage;
  }

  public static findHttpResponseMessage(messageToFind: string, data: HttpResponse<any> | any, searchInCaptionOnly = true, includeCaptionInResult = false): string | null {
    const searchString = messageToFind.toLowerCase();
    const httpMessages = this.getHttpResponseMessages(data);

    for (const message of httpMessages) {
      const fullMessage = Utilities.splitInTwo(message, ErrorCaption.Seperator);

      if (fullMessage.firstPart && fullMessage.firstPart.toLowerCase().indexOf(searchString) !== -1) {
        return includeCaptionInResult ? message : fullMessage.secondPart || fullMessage.firstPart;
      }
    }

    if (!searchInCaptionOnly) {
      for (const message of httpMessages) {

        if (message.toLowerCase().indexOf(searchString) !== -1) {
          if (includeCaptionInResult) {
            return message;
          } else {
            const fullMessage = Utilities.splitInTwo(message, ErrorCaption.Seperator);
            return fullMessage.secondPart || fullMessage.firstPart;
          }
        }
      }
    }

    return null;
  }

  public static getResponseBody(response: HttpResponseBase): any {
    if (response instanceof HttpResponse) {
      return response.body;
    }

    if (response instanceof HttpErrorResponse) {
      return response.error || response.message || response.statusText;
    }
  }

  public static checkNoNetwork(response: HttpResponseBase): boolean {
    return response instanceof HttpResponseBase && response.status == 0;
  }

  public static checkBadRequest(response: HttpResponseBase): boolean {
    return response instanceof HttpResponseBase && response.status == 400;
  }

  public static checkServerError(response: HttpResponseBase): boolean {
    return response instanceof HttpResponseBase && response.status == 500;
  }

  public static checkRequestTimeout(response: HttpResponseBase): boolean {
    return response instanceof HttpResponseBase && response.status == 408;
  }

  public static checkXSS(response: HttpResponseBase): boolean {
    // return response && response.status == 406 && response.error.Description === "error from anti xss middleware.";
    return response instanceof HttpResponseBase && response.status == 406;
  }

  public static checkAccessDenied(response: HttpResponseBase): boolean {
    return response instanceof HttpResponseBase && response.status == 403;
  }

  public static checkPreConditionFailed(response: HttpResponseBase): boolean {
    return response instanceof HttpResponseBase && response.status == 412;
  }

  public static checkNotFound(response: HttpResponseBase): boolean {
    return response instanceof HttpResponseBase && response.status == 404;
  }

  public static checkIsLocalHost(url: string, base?: string): boolean {
    if (url) {
      const location = new URL(url, base);
      return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    }
    return false;
  }

  public static getQueryParamsFromString(paramString: string): { [key: string]: string } {
    if (!paramString) {
      return {};
    }

    const params: { [key: string]: string } = {};
    for (const param of paramString.split('&')) {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value.replace(/\+/g, ' '));
      }
    }
    return params;
  }

  public static splitInTwo(text: string, separator: string, splitFromEnd = false): { firstPart: string, secondPart: string | null } {
    return (!text || !separator) ? { firstPart: '', secondPart: null } :
      (separatorIndex => separatorIndex === -1 ?
        { firstPart: text.trim(), secondPart: null } :
        { firstPart: text.substring(0, separatorIndex).trim(), secondPart: text.substring(separatorIndex + separator.length).trim() })
        (splitFromEnd ? text.lastIndexOf(separator) : text.indexOf(separator));
  }

};

