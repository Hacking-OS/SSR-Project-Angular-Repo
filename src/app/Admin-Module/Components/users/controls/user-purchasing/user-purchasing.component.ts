import { Component } from '@angular/core';
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddUserDialogComponent } from './dialog.component';

@Component({
    selector: 'app-user-purchasing',
    templateUrl: './user-purchasing.component.html',
    styleUrl: './user-purchasing.component.css',
    standalone: false
})
export class UserPurchasingComponent {
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  users = [
    { name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User' }
  ]; // Initial user list
  roles: string[] = ['Admin', 'User', 'Manager']; // Possible roles
  addUserForm: FormGroup; // Form to add new user

  // dataSource: MatTableDataSource<any>; // Data source for the table

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form group
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    // Initialize dataSource with the users array
    // this.dataSource = new MatTableDataSource(this.users);
  }

  onAddUser(): void {
    if (this.addUserForm.valid) {
      const newUser = this.addUserForm.value;
      this.users.push(newUser); // Add new user to the list
      this.users = [...this.users];
      this.dialog.closeAll(); // Close the dialog
    }
  }

  onRoleChange(user: any) {
    // Update role logic
    console.log('Role changed to: ', user.role);
  }

  onDeleteUser(user: any): void {
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1); // Remove the user from the array
      this.users = [...this.users];
      console.log('User deleted:', user); // For debugging purposes
    }
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '280px',
      data: { roles: this.roles }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users.push(result); // Add new user to the list
        this.users = [...this.users];
        this.dialog.closeAll(); // Close the dialog
      }
    });
  }

}
