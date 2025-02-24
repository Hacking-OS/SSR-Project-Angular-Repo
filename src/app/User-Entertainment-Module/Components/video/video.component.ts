import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { PostType } from '../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import { HttpMediaService } from '../../Http-Services/media.HttpService';
import { IMediaFile, IMediaFileUrl } from '../../Schemas/Interfaces/media.Interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DecryptService } from '../../../Shared-Module/Shared-Services/Security-Services/decrypt.Service';
// import Plyr from 'plyr';
// import videojs from 'video.js';
import Plyr from 'plyr';
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrl: './video.component.css',
  standalone:false
})
export class VideoComponent implements AfterViewInit, OnDestroy {
  mediaFiles: IMediaFileUrl = { url: '', thumbnail: '' };
  isVideo!: boolean;
  // @ViewChild('player', { static: false }) playerElement!: ElementRef<HTMLVideoElement>;
  constructor(private mediaService: HttpMediaService, private activatedRoute: ActivatedRoute, private decrypt: DecryptService, private router: Router) { }
  private player!: Plyr;
  private videoElement!: HTMLVideoElement;
  ngAfterViewInit() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    this.videoElement = document.getElementById('player') as HTMLVideoElement;

    if (!this.videoElement) {
      console.error('Video element not found');
      return;
    }

    // Initialize Plyr
    if (this.isVideo === true) {

      // this.player = new Plyr(this.videoElement, {
      //   controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
      //   settings: ['quality'],
      //   quality: {
      //     default: 360, // Default to the lowest quality initially
      //     options: [360, 480, 720, 1080], // Available resolutions
      //     // forced: false, // Allow dynamic changes
      //     onChange: (newQuality) => {
      //       console.log(`Quality changed to: ${newQuality}`);
      //     },
      //   },
      // });

      // Call setAutoQuality on initialization


      //   this.player = new Plyr(this.videoElement, {
        //     controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
    //     settings: ['quality'],
    //     quality: {
      //         default: 720, // Default quality
      //         options: [1080, 720, 480, 360], // Available resolutions
      //         forced: false, // Do not force a specific quality
      //         onChange: (newQuality) => {
        //             console.log(`Quality changed to: ${newQuality}`);
        //             if (newQuality === 'auto') {
          //                 this.setAutoQuality(); // Custom function to handle auto quality
          //             }
          //         },
    //     },
    // });


    this.player = new Plyr(this.videoElement, {
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
      settings: ['quality', 'speed', 'loop'],
      // settings: ['quality'],
        quality: {
          default: 720, // Default resolution
          options: [1080, 720, 480, 360], // Available resolutions
          forced: true,
          onChange: (newQuality) => {
            console.log(`Quality changed to: ${newQuality}`);
          },
        },
      });
      this.setAutoQuality();
    } else {
      this.player = new Plyr(this.videoElement, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
        settings: [], // No settings option for audio
        quality: {
          default: 0, // Quality is generally not applicable to audio
          options: [], // No quality options for audio
          forced: false, // No quality forcing
          onChange: (newQuality) => {
            console.log(`Quality changed to: ${newQuality}`);
          },
        },
      });
    }

    // this.player = new Plyr(this.videoElement, {
    //   controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
    //   settings: ['quality', 'speed', 'loop'], // Add settings as needed
    //   // Use attributes in HTML to define sources and tracks
    // });
  }
  }

  // ngAfterViewInit() {
  //   this.player = new Plyr('#player');
  //   this.player.on('ready', () => {
  //     console.log('Plyr is ready');
  //   });
  // Add more event listeners or functionality as needed
  // }

  async ngOnInit(): Promise<void> {

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params['fileName'] && params['isVideo']) {
        try {
          this.isVideo = params['isVideo'] === 'true';
          console.log("this.isVideo");
          console.log(this.isVideo);
          await this.mediaService.getDataAndSetList<IMediaFileUrl>(() => this.mediaService.GetApiResponse<IMediaFileUrl, string>('/api/getMediaUrl', params['fileName'], PostType.GET), (response) => {
            this.mediaFiles = response;
          }).catch((error) => {
            this.router.navigate(['/home'], { queryParams: {}, state: {} });
          });
        } catch (error) {
          this.router.navigate(['/home'], { queryParams: {}, state: {} });
        }
      }
    });
  }

// Update detectNetworkSpeed to handle type issues
detectNetworkSpeed(): number {
  // Check if the Network Information API is supported and type assert
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if ('connection' in navigator) {
      const connection = navigator.connection as NetworkInformation;
      return connection.downlink * 1000; // Convert Mbps to kbps
  }
  }
  // Fallback value if the Network Information API is not supported
  console.warn('Network Information API not supported, using default speed.');
  return 3000; // Default speed in kbps
}

// Method to set auto quality
setAutoQuality() {
  // Detect network speed
  const networkSpeed = this.detectNetworkSpeed();

  // Determine quality based on network speed
  let quality = 360; // Default quality
  if (networkSpeed >= 5000) { // High speed
      quality = 1080;
  } else if (networkSpeed >= 2000) { // Medium speed
      quality = 720;
  } else if (networkSpeed >= 1000) { // Low speed
      quality = 480;
  }

    console.log(`Attempting to set quality to: ${quality}`);
  // Update the player's quality setting
  // this.player.on('ready', () => {
  //   // Example: If there’s a method to change quality in the UI or player options
  //   // You may need to trigger the quality change through available UI methods
  //   // Example of updating player source based on quality
  //   // You may need to adjust this based on how Plyr handles quality
  //   this.player.source = {
  //     type: 'video',
  //     sources: [{
  //       src: this.mediaFiles.url,
  //       // src: this.getSourceForQuality(quality),
  //       type: 'video/mp4',
  //     }],
  //   };
  // });
}

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }
}

// TypeScript interface for NetworkInformation
interface NetworkInformation extends EventTarget {
  downlink: number; // Downlink speed in Mbps
  effectiveType: string; // Connection type (e.g., '4g', '3g')
  rtt: number; // Round-trip time in milliseconds
  saveData: boolean; // Whether the user has enabled data saving mode
}


