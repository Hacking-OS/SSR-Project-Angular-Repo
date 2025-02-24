import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
// import { MessengerService } from '../../Services/messenger.Service';
import { AlertService, AlertType } from '../../../Shared-Module/Alert-Services/alert.AlertService';
import { HttpLoginService } from '../../Http-Services/login.HttpService';
import { baseResponse } from '../../../Shared-Module/Shared-Services/Schemas/Interfaces/baseResponse.Interface';
import { MessageParams } from '../../Schemas/Interfaces/message.Interface';
import { PostType } from '../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { SocketService } from '../../../Shared-Module/Shared-Services/Socket-IO-Services/socket.io.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { SharedService } from '../../../Shared-Module/Shared-Services/shared.Service';

@Component({
    selector: 'app-messenger',
    templateUrl: './messenger.component.html',
    styleUrls: ['./messenger.component.css'],
    standalone: false,
    animations:[
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('300ms ease-in', style({ opacity: 1 })),
        ]),
        transition(':leave', [
          animate('300ms ease-out', style({ opacity: 0 })),
        ]),
      ]),
     trigger('slideIn', [
        transition(':enter', [
          style({ transform: 'translateX(-100%)', opacity: 0 }),
          animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
        ]),
        transition(':leave', [
          animate('400ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 })),
        ]),
      ]),
    ]
})

export class MessengerComponent {
  showMessages: Array<MessageParams> = [];
  userMessage: string | undefined;
  userId: number | undefined;
  // username: string = 'User';
  // message: string = '';
  // messages: { username: string, message: string, timestamp: string }[] = [];

  // userID: number = Number(localStorage.getItem('userId')) || 1;
  // userEmail: string = localStorage.getItem('email') || 'user@example.com';
  // userName: string = localStorage.getItem('userName') || "User";
  // isAdmin: boolean = localStorage.getItem('role') === 'admin';
  userID: number;
  userEmail: string;
  userName: string;
  isAdmin: boolean;


  userMessageFromIO: string = '';
  // uuid_User: string = '1234-5678-9012'; // Example UUID
  isTyping: boolean = false;
  typingUserName: string = '';
  private typingTimeout: any;
  messages: Array<MessageParams> = [];
  userGroups = [
    {
      userName: 'Group Chat 1',
      uuid_User: 'group1',
      profileImage: 'path/to/group1-image.jpg', // Add appropriate image path
      isActive: true, // Set to true or false based on user status
      isAway: false // Set to true or false based on user status
    },
    {
      userName: 'Group Chat 2',
      uuid_User: 'group2',
      profileImage: 'path/to/group2-image.jpg', // Add appropriate image path
      isActive: false, // Example status
      isAway: false // Example status
    },
    {
      userName: 'User Chat 1',
      uuid_User: 'user1',
      profileImage: 'path/to/user1-image.jpg', // Add appropriate image path
      isActive: false, // Example status
      isAway: true // Example status
    }
  ];

  // Set the initially selected user
  selectedUser: any = this.userGroups[0];

  // messages: { userID: number, userEmail: string, userName: string, userMessage: string, isAdmin: boolean, messagedAt: string }[] = [];
  // messages: { userID: number, userEmail: string, userName: string, userMessage: string, uuid_User: string, isAdmin: boolean, messagedAt: string }[] = [];
  // private messageService:MessengerService
  constructor(private loginService: HttpLoginService, private alertService: AlertService, private socketService: SocketService,private sharedService:SharedService) { }
  ngOnInit(): void {
    this.userId = this.sharedService.getUserInfo()?.userId;
    this.userID = this.sharedService.getUserInfo()?.userId;
    this.userEmail = this.sharedService.getUserInfo()?.userEmailId;
    this.userName = this.sharedService.getUserInfo()?.userName;
    this.isAdmin = this.sharedService.getUserInfo()?.role === 'admin';
    this.getMessages();
    // Load previous messages
    // this.socketService.onPreviousMessages().subscribe((msgs) => this.messages = msgs);
    this.socketService.onMessage().subscribe(msg => this.messages.push(msg));
    this.socketService.onTyping().subscribe((userName: string) => {
      this.typingUserName = userName;
      this.isTyping = true;

      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.isTyping = false;
      }, 3000);  // Hide after 3 seconds
    });
  }
  sendMessage(form: NgForm) {
    this.userMessage;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    let createMessage = () => {
      return {
        id: localStorage.getItem('userId'),
        email: localStorage.getItem('email'),
        name: localStorage.getItem('userName'),
        message: this.userMessage,
        isAdmin: (localStorage.getItem('role') === 'admin') ? 1 : 0
      };
    };
    this.loginService.getDataAndSetList<baseResponse>(() => this.loginService.GetApiResponse<baseResponse, {}>('/message/send/', createMessage(), PostType.POST), (response: baseResponse) => {
      this.alertService.showAlert(response.message, AlertType.Success);
      this.getMessages();
    });
  }
    // this.messageService.sendMessage(createMessage()).subscribe((response: any) => {
    //   this.alertService.showAlert(response.message, AlertType.Success);
    //   this.getMessages();
    //   form.reset();
    // });
  }

  deleteMessage(deleteMessageUUID: string) {
    this.loginService.getDataAndSetList<baseResponse>(() => this.loginService.GetApiResponse<baseResponse, string>('/message/delete', deleteMessageUUID, PostType.DELETE), (response: baseResponse) => {
      this.alertService.showAlert(response.message, AlertType.Success);
      this.getMessages();
    });
    // this.messageService.deleteMessage(deleteMessageUUID).subscribe((response:any) => {
    //   this.alertService.showAlert(response.message,AlertType.Success);
    //   this.getMessages();
    // });
  }

  getMessages() {
    this.loginService.getDataAndSetList<Array<MessageParams>>(() => this.loginService.GetApiResponse<Array<MessageParams>, undefined>('/message/get/', undefined, PostType.GET), (response: Array<MessageParams>) => {
      this.messages = response as any;
      this.showMessages = response;

    });
  }

  sendMessageFromSocket(): void {
    if (this.userMessageFromIO.trim()) {
      this.socketService.sendMessage({
        userID: this.userID,
        userEmail: this.userEmail,
        userName: this.userName,
        userMessage: this.userMessageFromIO,
        // uuid_User: this.uuid_User,
        isAdmin: this.isAdmin
      });
      this.getMessages();
      this.userMessageFromIO = '';
    }
  }

  onTyping(): void {
    this.socketService.sendTypingNotification(this.userName);
    // this.getMessages();
  }

  openChat(user: any) {
    this.selectedUser = user;
    // Logic to load messages for the selected user/group
  }
}
