
import { Component, Signal, computed, effect, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { empInterface } from './Interface/home.Interface';
import { AlertService, AlertType } from '../../Alert-Services/alert.AlertService';
import { RefreshtokenService } from '../../Interceptors/refreshtoken.service';
import { SharedService } from '../../Shared-Services/shared.Service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent {
  usersDataFromDatabase:any;
  catDropdown:any;
  // userRole=localStorage.getItem('role');
  userRole:string;
  safeHtmlContent!:SafeHtml;

  firstName=signal<string>("Mufaddal");
  lastName=signal<string>("Bandukwala");
  fullName = computed<string>(()=> this.firstName()+" " + this.lastName());
  lastSearches: string[] = ['Product 1', 'Product 2', 'Product 3'];
  mostSearchedCategories: string[] = ['Electronics', 'Books', 'Clothing'];

  // Demo data for featured products with placeholder images
  featuredProducts = [
    {
      name: 'Product 1',
      description: 'This is product 1 description.',
      image: 'https://via.placeholder.com/300',
      isLoading: true,
    },
    {
      name: 'Product 2',
      description: 'This is product 2 description.',
      image: 'https://via.placeholder.com/300',
      isLoading: true,
    },
    {
      name: 'Product 3',
      description: 'This is product 3 description.',
      image: 'https://via.placeholder.com/300',
      isLoading: true,
    },
  ];
  // featuredProducts = [
  //   {
  //     name: 'Wireless Headphones',
  //     description: 'Experience high-quality sound with these wireless headphones.',
  //     image: 'https://via.placeholder.com/150?text=Headphones',
  //     isLoading: true // Initially set to true
  //   },
  //   {
  //     name: 'Smartwatch',
  //     description: 'Stay connected with this stylish smartwatch.',
  //     image: 'https://via.placeholder.com/150?text=Smartwatch',
  //     isLoading: true // Initially set to true
  //   },
  //   {
  //     name: 'Bluetooth Speaker',
  //     description: 'Enjoy your music on the go with this portable Bluetooth speaker.',
  //     image: 'https://via.placeholder.com/150?text=Speaker',
  //     isLoading: true // Initially set to true
  //   },
  // ];

  // Demo data for special offers
  specialOffers: string[] = [
    '20% off on all electronics',
    'Buy one get one free on select items',
    'Free shipping on orders over $50',
  ];

  userReviews: any[] = [
    {
      image: 'https://via.placeholder.com/40', // Sample user image
      user: 'John Doe',
      comment: 'This product is amazing!',
      rating: 5,
      replies: [] // Initialize replies as an empty array
    },
    {
      image: 'https://via.placeholder.com/40', // Sample user image
      user: 'Jane Smith',
      comment: 'I really enjoyed using this product.',
      rating: 4,
      replies: [] // Initialize replies as an empty array
    },
    {
      image: 'https://via.placeholder.com/40', // Sample user image
      user: 'Sam Johnson',
      comment: 'Not what I expected, but it works.',
      rating: 3,
      replies: [] // Initialize replies as an empty array
    }
  ];
  // topProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
  //   id: i + 1,
  //   name: `Product ${i + 1}`,
  //   description: `Description of Product ${i + 1}`,
  //   image: `https://via.placeholder.com/150`
  // }));

  // latestProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
  //   id: i + 1,
  //   name: `Latest Product ${i + 1}`,
  //   description: `Description of Latest Product ${i + 1}`,
  //   image: `https://via.placeholder.com/150`
  // }));

  // userReviews: Review[] = [
  //   { user: 'User A', comment: 'Amazing product!' },
  //   { user: 'User B', comment: 'Best purchase I\'ve made!' },
  //   { user: 'User C', comment: 'Highly recommend!' },
  // ];
  replyText: { [key: string]: string } = {};
  isReplyingTo: { [key: string]: boolean } = {};
  quantity = signal<number>(5);
  // <Array<object>>
//   employees = signal([
//  { name:"Mufaddal",position:"Manager",department:"Manager"},
//  { name:"Mufad3dal",position:"Mana3ger",department:"Man3ager"},
//  { name:"Mufa4ddal",position:"Man4ager",department:"Ma4nager"},
//  { name:"M6ufa5ddal",position:"Man5ager",department:"M5anager"},
//  { name:"Mufa7ddal",position:"Mana6ger",department:"Ma6nager"},
//  { name:"Mufad7dal",position:"Mana7ger",department:"Ma7nager"},
//  { name:"Mufa7ddal",position:"Mana8ger",department:"M8anager"},
// ]);
  employees = signal<Array<empInterface>>([
 { name:"Mufaddal",position:"Manager",department:"Manager"},
 { name:"Mufad3dal",position:"Mana3ger",department:"Man3ager"},
 { name:"Mufa4ddal",position:"Man4ager",department:"Ma4nager"},
 { name:"M6ufa5ddal",position:"Man5ager",department:"M5anager"},
 { name:"Mufa7ddal",position:"Mana6ger",department:"Ma6nager"},
 { name:"Mufad7dal",position:"Mana7ger",department:"Ma7nager"},
 { name:"Mufa7ddal",position:"Mana8ger",department:"M8anager"},
]);
//   employees = signal<Array<object>>([
//  { name:"Mufaddal",position:"Manager",department:"Manager"},
//  { name:"Mufad3dal",position:"Mana3ger",department:"Man3ager"},
//  { name:"Mufa4ddal",position:"Man4ager",department:"Ma4nager"},
//  { name:"M6ufa5ddal",position:"Man5ager",department:"M5anager"},
//  { name:"Mufa7ddal",position:"Mana6ger",department:"Ma6nager"},
//  { name:"Mufad7dal",position:"Mana7ger",department:"Ma7nager"},
//  { name:"Mufa7ddal",position:"Mana8ger",department:"M8anager"},
// ]);

employeeForm!:FormGroup;

constructor(private getToken:RefreshtokenService,
  private alertService:AlertService,
  private sanitizer: DomSanitizer,
  private fb: FormBuilder,
  private sharedService:SharedService
  ){

  // getToken.isValid(localStorage.getItem('token')).subscribe((data:any)=>{
  //   this.usersDataFromDatabase=data;
  // });
}

ngOnInit(): void {
 this.userRole = this.sharedService.getUserInfo()?.role;
 this.employeeForm=this.fb.group({
   name:new FormControl(''),
   position:new FormControl(''),
   department:new FormControl(''),
 });
}


changeFirstName(name:string):void {
  this.firstName.set(name);
}
changeLastName(name:string):void {
  this.lastName.set(name);
}


add(){
  this.quantity.update(q=>q+1);
}
remove(){
  if(this.quantity()<=0){
    this.alertService.showAlert("value must be greater than 0",AlertType.Error);
  }else{
    this.quantity.update(q=>q-1);
  }
}

sideEffect = effect(()=>console.log("Some thing has changed : " + JSON.stringify(this.employees()[this.employees().length - 1])));

addEmployee():void {
  // this.employees.mutate(emplist=>{
  //   emplist.push(this.employeeForm.value);
  // });
  console.log(this.employeeForm.value);
  // console.log(emp.value);
  // return;
  this.employees.update(empList => [...empList, this.employeeForm.value]);
}

submitReply(review: any) {
  if (this.replyText[review.user]) {
    review.replies.push({
      user: "13123123", // Assuming the current user is replying
      comment: this.replyText[review.user]
    });
    this.replyText[review.user] = ''; // Clear the input after submitting
  }
}

toggleReplyInput(review: any) {
  // Close any previously opened reply inputs
  for (const user in this.isReplyingTo) {
    if (user !== review.user) {
      this.isReplyingTo[user] = false;
    }
  }
  // Toggle the current review's reply input
  this.isReplyingTo[review.user] = !this.isReplyingTo[review.user];
}

onImageLoad(product: any): void {
  product.isLoading = false; // Image has loaded
}

onImageError(image: any): void {
  // image.isLoading = false; // Image failed to load
  image.image = 'assets/noImage.png'; // Fallback image
}

showmessage(showMessage:string):void {

  // this.alertService.showAlert("Buddy You code is valid !",AlertType.Success);
  // this.alertService.showAlert("Alert! sBuddy You code is valid !",AlertType.Info);
  switch (showMessage) {
    case "Error":
      this.alertService.showAlertPopup("Error!","Error Message",AlertType.Error);
      break;
    case "Success":
      this.alertService.showAlertPopup("Success!","Success Message",AlertType.Success);
      break;
    case "Warning":
      this.alertService.showAlertPopup("Warning!","Warning Message",AlertType.Warning);
      break;
    case "Info":
      this.alertService.showAlertPopup("Info!","Info Message",AlertType.Info);
      break;
  }
  // this.alertService.showAlert("Buddy You code is valid !",AlertType.Warning);
  // const unsafeHtml = '<script>alert("XSS Attack!");</script>';
  const unsafeHtml = '<script>Alert("Hello World")</script> 4530643968';
  this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
  // this.alertService.showAlert("Buddy You code is valid !",AlertType.Error);
  // this.toast2.success("Buddy You code is valid !",AlertType.Success);

}
}

