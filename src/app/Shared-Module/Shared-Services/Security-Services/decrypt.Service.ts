import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DecryptService {

  constructor() { }

  private readonly secretKey = environment.SECRET_AUTH_KEY;
  private readonly saltKey = environment.SALT_KEY;

  public decrypt<T = any>(cipherTextWithSalt: string): T {
    try {
      const decoded = decodeURIComponent(cipherTextWithSalt);
      console.log("Decoded:", decoded); // Log the decoded string

      // Split the salt and cipherText
      const parts = decoded.split(':');
      if (parts.length !== 2) {
        throw new Error("Invalid encrypted format. Ensure it contains both salt and cipherText.");
      }

      const [salt, cipherText] = parts;

      // Derive a key using PBKDF2
      const key = CryptoJS.PBKDF2(this.secretKey, salt, {
        keySize: 256 / 32,
        iterations: 1000
      }).toString(); // Convert key to string

      // Decrypt the ciphertext using AES
      const decryptedBytes = CryptoJS.AES.decrypt(cipherText, key);
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

      // Check if the decrypted text is empty
      if (!decryptedText) {
        throw new Error("Decryption resulted in empty text.");
      }

      try {
        return JSON.parse(decryptedText) as T; // Return the parsed plaintext object
      } catch(e) {
         throw new DOMException("Bit was corrupted , Failed To Decrypt the Provided value ! ","Error");
      }
    } catch (error:any) {
      console.error("Decryption Error:", error);
      throw new DOMException(`${error.message}`,"Error"); // Return as plain string if parsing fails
    }
  }
}
