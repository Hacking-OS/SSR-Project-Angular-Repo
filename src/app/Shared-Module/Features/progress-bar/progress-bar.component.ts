import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.css',
    standalone: false
})
export class ProgressBarComponent {
  progress: number=0;
  interval: any;
  @Input() checkFile: File | undefined;
  @Input() currentProgress: number | undefined;
  @Input() currentStatus: string | undefined;
  @Output() progressBar: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();
ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  //  console.log(this.checkFile);
  this.progress = 0;
}
  ngOnChanges(changes: SimpleChanges): void {
    console.log("Mufaddal changes");
    console.log(this.checkFile);
    if (this.checkFile && this.checkFile !== undefined) {
      this.uploadFile();
    }else{
      if(this.currentProgress) {
        this.progress = this.currentProgress;
      } else {
        this.progress = 0;
        this.progressBar.emit(this.progress);
      }
    }
  }
  uploadFile() {
    if (this.checkFile) { } else { return; }
    console.log("Mufaddal changes2");
    console.log(this.checkFile);

 // Clear previous interval
 clearInterval(this.interval);

 // Start new interval for smooth transition
 this.interval = setInterval(() => {
   if (this.progress === 100) {
     clearInterval(this.interval);
     return;
   }
   this.progress += 10;
   this.progressBar.emit(this.progress);
 }, 200);
    // this.interval = setInterval(() => {
    //   if (this.progress === 100) {
    //     clearInterval(this.interval);
    //     return;
    //   }
    //   this.progress += 10;
    //   this.progressBar.emit(this.progress);
    //   if (this.progress === 100) {
    //     clearInterval(this.interval);
    //     this.progressBar.emit(this.progress);
    //     if (!this.checkFile) {
    //       // this.progress = undefined;
    //     }
    //   }
    // }, 500);


    // let progress = 0;
    // const interval = setInterval(() => {
    //   progress += 10;
    //   this.progress = progress;
    //   if (progress === 100) {
    //     this.progressBar.emit(progress);
    //     clearInterval(interval);
    //     if(this.checkFile){
    //     }else{
    //       // this.progress = undefined;
    //     }
    //   }
    // }, 500);
    // const xhr: XMLHttpRequest = new XMLHttpRequest();
    // xhr.upload.addEventListener('progress', (event) => {
    //   if (event.lengthComputable) {
    //     this.progress = Math.round((event.loaded / event.total) * 100);
    //   }
    // });
    // xhr.onreadystatechange = () => {
    //   if (xhr.readyState === XMLHttpRequest.DONE) {
    //     if (xhr.status === 200) {
    //       // this.fileUploaded.emit(file);
    //       this.progress = undefined;
    //     }
    //   }
    // }
  }
}
