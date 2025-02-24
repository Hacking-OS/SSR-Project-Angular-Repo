interface UserTransaction {
  user: string;
  balance: number;
  transactions: string[];
}
import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-hmac-auth-request',
    template: `<div>Check console for HMAC and payload verification</div>`,
    standalone: false
})
export class HmacAuthComponent {
  private readonly secretKey = 'M15JM8X2TXAGApOw9VmdIOQskHxqbuDdShQg2aZnNBE=';
  payload: Array<UserTransaction> = [{"user":"Sajid","balance":1000,"transactions":["Withdrawal","Shall","UI","UX"]},{"user":"Amjad","balance":500,"transactions":["Withdrawal","Shall","UI"]}];

  ngOnInit() {

    // Step 1: Generate Salt
    const salt = this.generateSalt();
    console.log('Generated Salt:', salt);

    // Step 2: Generate HMAC with Salt
    const hmac = this.generateHMAC(JSON.stringify(this.payload), salt);
    console.log('Generated HMAC:', hmac);

    // Step 3: Combine HMAC and Salt into a single string
    // const hmacWithSalt = `${hmac}`;
    // const hmacWithSalt = `${hmac}:${salt}`;
    console.log('HMAC with Salt:', hmac);

    // Step 4: Create request with the original payload and the HMAC+Salt
    const request = {
      payload: this.payload, // Original payload
      hmac: hmac // HMAC + Salt
    };

    console.log('Request:', request);

    // Step 5: Simulate verifying the payload
    const isVerified = this.verifyHMAC(request);
    console.log('Is Payload Verified?', isVerified);

    // Step 6: Simulate tampering with the payload
    // const tamperedPayload = { ...payload, message: 'Tampered!' };
    const tamperedPayload = this.payload.map(user => ({
      ...user,
      transactions: ['any', 'way', 'hackathon']
    }));

    const tamperedRequest = {
      payload: tamperedPayload, // Tampered payload
      hmac: hmac // Original HMAC + Salt
    };

    console.log('Tampered Request:', tamperedRequest);

    // Step 7: Verify tampered payload (should fail)
    const isTamperedVerified = this.verifyHMAC(tamperedRequest);
    console.log('Is Tampered Payload Verified?', isTamperedVerified);
  }

  // addParameter(key: string, value: any) {
  //   this.payload[key] = value; // Dynamically adding key-value pairs
  // }
  // Generate a random salt
  generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex); // 128-bit salt
  }

  // Generate HMAC using SHA-256, the payload, and salt
  generateHMAC(payload: string, salt: string): string {
    const secretKeyBytes = CryptoJS.enc.Base64.parse(this.secretKey);
    const dataBytes = CryptoJS.enc.Utf8.parse(payload);
    const signatureBytes = CryptoJS.HmacSHA256(dataBytes, secretKeyBytes);
    return CryptoJS.enc.Base64.stringify(signatureBytes);
    // return CryptoJS.HmacSHA256(payload, this.secretKey).toString();
    // return CryptoJS.HmacSHA256(payload, this.secretKey + salt).toString(CryptoJS.enc.Hex);
  }

  // Simulate verification process (what the .NET backend would do)
  verifyHMAC(request: { payload: any; hmac: string }): boolean {
    console.log('Verifying HMAC...');

    const { payload, hmac } = request;

    // Split the HMAC and Salt from the combined string
    const receivedHmac = hmac;
    // const [receivedHmac, receivedSalt] = hmacWithSalt.split(':');

    // Recalculate the HMAC using the received payload and salt
    const recalculatedHmac = this.generateHMAC(JSON.stringify(payload), '');

    console.log('Received HMAC:', receivedHmac);
    console.log('Recalculated HMAC:', recalculatedHmac);

    // Compare the recalculated HMAC with the received HMAC
    return recalculatedHmac === receivedHmac;
  }
}
