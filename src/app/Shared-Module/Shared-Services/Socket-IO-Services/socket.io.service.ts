import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.baseUrl);
    // this.socket = io('http://192.168.0.38:8080');
  }

  sendMessage(message: {
    userID: number,
    userEmail: string,
    userName: string,
    userMessage: string,
    isAdmin: boolean
  }): void {
    this.socket.emit('chatMessage', message);
  }

  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('chatMessage', (msg) => {
        observer.next(msg);
      });

      return () => this.socket.off('chatMessage');
    });
  }

  onPreviousMessages(): Observable<{
    userID: number,
    userEmail: string,
    userName: string,
    userMessage: string,
    isAdmin: boolean,
    messagedAt: string
  }[]> {
    return new Observable(observer => {
      this.socket.on('previousMessages', (msgs) => {
        observer.next(msgs);
      });

      return () => this.socket.off('previousMessages');
    });
  }


  sendTypingNotification(userName: string): void {
    this.socket.emit('typing', userName);
  }

  onTyping(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('typing', (userName: string) => {
        observer.next(userName);
      });

      return () => this.socket.off('typing');
    });
  }


  listenToProgress<T>(): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on('progress', (data) => {
        subscriber.next(data);
      });

      return () => {
        this.socket.off('progress');
      };
    });
  }
}


