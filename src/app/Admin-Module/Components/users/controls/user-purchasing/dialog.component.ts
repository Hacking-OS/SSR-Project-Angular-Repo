import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user-dialog',
  template: `
    <h1 mat-dialog-title>Add New User</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="name" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="email" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Role</mat-label>
        <mat-select [(ngModel)]="role">
          <mat-option value="Admin">Admin</mat-option>
          <mat-option value="User">User</mat-option>
          <mat-option value="Manager">Manager</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="closeDialog()">Cancel</button>
      <button mat-button (click)="addUser()">Add</button>
    </div>
  `,
  standalone:false,
  styles:[
    `
    /* Dialog container */
.mat-dialog-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

/* Title of the dialog */
.mat-dialog-title {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

/* Dialog content */
.mat-dialog-content {
  font-size: 1rem;
  color: #555;
  padding: 10px 0;
}

/* Form fields in the dialog */
.mat-form-field {
  width: 100%;
  margin-bottom: 15px;
}

.mat-form-field mat-label {
  font-size: 1rem;
  color: #333;
}

/* Buttons in the dialog */
.mat-dialog-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}

.mat-dialog-actions button {
  margin: 0 5px;
}

/* Styling for the cancel button */
button.mat-button {
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 8px 16px;
}

/* Styling for the add button */
button.mat-button.mat-accent {
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-weight: bold;
}

button.mat-button.mat-accent:hover {
  background-color: #303f9f;
}

/* Dialog action buttons when the dialog is centered */
.mat-dialog-actions {
  margin-top: 20px;
  text-align: center;
}

    `
  ]
})
export class AddUserDialogComponent {
  name: string;
  email: string;
  role: string = 'User';

  constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  addUser(): void {
    const user = { name: this.name, email: this.email, role: this.role };
    this.dialogRef.close(user);
  }
}
