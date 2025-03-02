import { Injectable, NgModule } from '@angular/core';
import * as CryptoJS from 'crypto-js';

// @NgModule({})
@Injectable({ providedIn: 'root' })
export class CspNonceService {
  async generateNonce(): Promise<string> {
    try {
      // Check if the Web Crypto API is available
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (window.crypto && window.crypto.subtle) {
        const randomBytes = new Uint8Array(16);
        await window.crypto.getRandomValues(randomBytes);
        const encoder = new TextEncoder();
        const data = encoder.encode(String.fromCharCode(...randomBytes));
        const nonce = btoa(String.fromCharCode(...data));
        return `'nonce-${nonce}'`;
      } else {
        // Fallback for browsers without Web Crypto API support
        const randomBytes = new Array(16)
          .fill(0)
          .map(() => Math.floor(Math.random() * 256));
        const nonce = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.create(randomBytes));
        return `'nonce-${nonce}'`;
      }
      }
    } catch (error) {
      console.error('Error generating nonce:', error);
      // Handle the error as needed
      return '';
    }
  }
}


