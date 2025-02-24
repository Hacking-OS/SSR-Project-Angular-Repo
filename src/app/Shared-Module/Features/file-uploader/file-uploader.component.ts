import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrl: './file-uploader.component.css',
    standalone: false
})
export class FileUploaderComponent {

  progressBar: number | undefined;
  uploadingFile: File|undefined=undefined;
  @Output() uploadParamsEmit: EventEmitter<File> = new EventEmitter<File>();
  onFileSelected(event:any) {
    const uploadingFile = event.target.files[0];
    this.uploadingFile=uploadingFile;
    // console.log(uploadingFile);
        this.uploadParamsEmit.emit(uploadingFile);
        console.log('Selected file:',uploadingFile);
  }

  deleteFile(){
    this.uploadingFile=undefined;
    this.uploadParamsEmit.emit(this.uploadingFile);
  }

  // Method to handle progress bar value emitted from UploaderComponent
  onProgressBar(progress: number | undefined) {
    this.progressBar = progress;
  }
}
