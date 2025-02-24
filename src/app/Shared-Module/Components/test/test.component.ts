import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Hls from 'hls.js';
import { HttpMainService } from '../../Http-Services/main.HttpService';
import { PostType } from '../../Shared-Services/Schemas/Enums/responseType.Enum';
import { IMediaVideoDataList, IMediaVideoDataResponse } from '../Schemas/Models/test.Model';
import { SocketService } from '../../Shared-Services/Socket-IO-Services/socket.io.service';

@Component({
  selector: 'app-test',
  standalone: false,

  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('video') video!: ElementRef;
constructor(private mainService:HttpMainService,private socketService:SocketService){}
  isModalOpen = false; // Controls modal visibility
  isLoaderVisible = false; // Controls loader visibility
  videoList:IMediaVideoDataList[] = [];
  progress:number;
  status:string;
ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.socketService.listenToProgress<{progress:number,status:string}>().subscribe((data: {progress:number,status:string}) => {
    if(data.progress === 100) {
      this.progress = undefined;
      return;
    }
    this.progress = data.progress;
    this.status = data.status;
  });
  this.loadVideos();
}

  uploadVideo() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const title = (document.getElementById('title') as any).value;
    const fileInput = document.getElementById('videoUpload');
    const formData = new FormData();

    formData.append('title', title);
    formData.append('video', (fileInput as any).files[0]);
    this.isLoaderVisible = true; 
this.mainService.getDataAndSetList<{message:string}>(()=>this.mainService.GetApiResponse<{message:string},FormData>('/media-upload/upload',formData,PostType.POST),(response)=>{
  if (response.message === 'Video uploaded and converted successfully.') {
    alert('Video uploaded and converted successfully.');
    // fileInput.value = null;
    this.isLoaderVisible = false; 
    this.loadVideos();
  } else {

  }
});

    // fetch('http://localhost:8080/media-upload/upload', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.message === 'Video uploaded and converted successfully.') {
    //       // loadTimeline();
    //       // loader.classList.add('hidden'); // Hide loader
    //       // document.body.classList.remove('no-scroll');
    //       alert('Video uploaded and converted successfully.');
    //       // fileInput.value = null;
    //       this.isLoaderVisible = false; 
    //       this.loadVideos();
    //     } else {
    //       // loader.classList.add('hidden');
    //       // fileInput.value = null;
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
}
  }

  openModal(videoElement: any): void {
    this.isLoaderVisible = true; 
    const videoSrc = videoElement.getAttribute('data-video');
    const video = this.video.nativeElement;
    // Check if HLS.js is supported
    if (Hls.isSupported()) {
      setTimeout(() => {
        this.isLoaderVisible = false; // Hide loader after video is loaded
        this.isModalOpen = true; // Open the modal
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }, 5000);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      setTimeout(() => {
        this.isLoaderVisible = false; // Hide loader after video is loaded
        this.isModalOpen = true; // Open the modal
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      }, 5000);

    } else {
      this.isLoaderVisible = false; // Hide loader after video is loaded
      this.isModalOpen = false; // Open the modal
      console.error('HLS not supported in this browser');
    }
  }

  loadVideos() {
    // /media/data/view/view.json
      this.mainService.getDataAndSetList<IMediaVideoDataResponse>(()=> this.mainService.GetApiResponse<IMediaVideoDataResponse,null>('/media-upload/data',null,PostType.GET),(response)=>{
        this.videoList = response.videos;
      });
  }

  closeModal(): void {
    const video = this.video.nativeElement;
    this.isModalOpen = false; // Close the modal
    video.pause();
    video.src = '';
  }
}
