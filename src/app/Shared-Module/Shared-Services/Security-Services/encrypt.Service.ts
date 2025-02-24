import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  static salt: string;

  constructor() { }
  private static readonly secretKey = environment.SECRET_AUTH_KEY;
  private static readonly saltKey  = environment.SALT_KEY;
  static encrypt(plainText: any): string {
    try {
      const salt = this.saltKey; // Generate a random salt
      // Derive a key using PBKDF2
      const key = CryptoJS.PBKDF2(this.secretKey, salt, {
        keySize: 256 / 32,
        iterations: 1000
      }).toString(); // Convert key to string

      // Encrypt the plain text (stringify if it's an object)
      const cipherText = CryptoJS.AES.encrypt(typeof plainText === "string" ? plainText : JSON.stringify(plainText),key).toString();

      // Combine salt and ciphertext
      const combined = `${salt}:${cipherText}`;

      return encodeURIComponent(combined); // Return URI encoded string for safe transport
    } catch (error:any) {
      console.error("Encryption Error:", error);
      return `Encryption failed: ${error.message}`;
    }
  }
}
