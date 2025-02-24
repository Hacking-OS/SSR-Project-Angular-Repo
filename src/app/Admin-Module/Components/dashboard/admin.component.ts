import { trigger, transition, style, animate, keyframes, group } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: false,
    animations:[
    // Route animation for transitions
      trigger('routeAnimations', [
        transition('* <=> *', [
          style({ opacity: 1, transform: 'translateY(10px)' }),
          animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
      ]),

  // Fade-in animation with opacity and scale
  trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 1, transform: 'scale(1.8)' }), // Start with slightly smaller scale
      group([
        animate(
          '300ms ease-in', // Shorter duration for instant feedback
          style({ transform: 'scale(1.08)' }) // Slight overshoot for visual pop
        ),
        animate(
          '600ms ease-out', // Longer fade for smoother effect
          style({ opacity: 1 })
        ),
      ]),
      animate(
        '200ms ease-in', // Settle animation
        style({ transform: 'scale(1)' })
      ),
    ]),
  ]),

  // Scale-up animation with bounce effect
  trigger('scaleUp', [
    transition(':enter', [
      style({ transform: 'scale(0.5)' }), // Start smaller
      animate(
        '1.2s ease-out', // Ease-out for smooth finish
        keyframes([
          style({ transform: 'scale(0.8)', offset: 0.5 }), // Slight overshoot
          style({ transform: 'scale(1.05)', offset: 0.8 }), // Bounce back slightly larger
          style({ transform: 'scale(1)', offset: 1 }), // Settle at normal size
        ])
      )
    ]),
  ]),
    ]
})
export class AdminComponent {
  cards = [
    {
      title: 'Total Users',
      subtitle: 'Active Users Count',
      content: '1200 Users',
    },
    {
      title: 'Total Revenue',
      subtitle: 'Earnings This Month',
      content: '$5000',
    },
    {
      title: 'Pending Orders',
      subtitle: 'Unprocessed Orders',
      content: '45 Orders',
    },
    {
      title: 'New Messages',
      subtitle: 'Unread Messages',
      content: '32 Messages',
    }
  ];

isSidebarOpen:boolean = true; // Sidebar is open by default
activeTab = 'dashboard'; // Default active tab

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.isSidebarOpen = true;
}


toggleSidebar(): void {
  this.isSidebarOpen = !this.isSidebarOpen;
}

setActiveTab(tab: string): void {
  this.activeTab = tab;
}
}
