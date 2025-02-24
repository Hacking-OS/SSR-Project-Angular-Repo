import { Component } from '@angular/core';
import { IMediaFile, IMediaFileName } from '../../Schemas/Interfaces/media.Interface';
import { HttpMediaService } from '../../Http-Services/media.HttpService';
import { PostType } from '../../../Shared-Module/Shared-Services/Schemas/Enums/responseType.Enum';
import Plyr from 'plyr';
import { Router } from '@angular/router';
import { EncryptService } from '../../../Shared-Module/Shared-Services/Security-Services/encrypt.Service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

@Component({
    selector: 'app-entertainment',
    templateUrl: './entertainment.component.html',
    styleUrl: './entertainment.component.css',
    standalone: false
})



export class EntertainmentComponent {
  player!: Plyr;
  mediaFiles: IMediaFileName[] = [];
  constructor(private mediaService: HttpMediaService, private router: Router,private http:HttpClient) { }

  async ngOnInit(): Promise<void> {
    await this.mediaService.getDataAndSetList<{result:IMediaFileName[]}>(() => this.mediaService.GetApiResponse<{result:IMediaFileName[]}, undefined>('/api/mediaList', undefined, PostType.GET),
      (response: {result:IMediaFileName[]}) => {
        this.mediaFiles = response.result;
      });
  }

  createUrl_IsVideo(fileName: string,isVideo:boolean): void {
    const encryptedFileName = EncryptService.encrypt(fileName);
    this.router.navigate(['/content/video'], { queryParams: { fileName: encodeURIComponent(encryptedFileName),isVideo:isVideo }});
  }


  isVideo(fileName: string): boolean {
    return fileName.endsWith('.mp4') || fileName.endsWith('.mkv');
  }



  extractEpisodeInfo(fileName: string): string {
    // Define the known suffixes (file extensions) to be removed
    const suffixes = ['.mkv', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']; // Add more extensions if needed

    // Check if the filename contains a known suffix
    for (const suffix of suffixes) {
      const prefix = '[Judas] Black Clover - ';
      const only = '.mkv';
      if (fileName.startsWith(prefix) && fileName.endsWith(only)) {
        // Extract the part of the filename without the prefix and suffix
        return fileName.slice(prefix.length, -suffix.length);
      }
      if (fileName.endsWith(suffix)) {
        // Remove the suffix (extension)
        return fileName.slice(0, -suffix.length);
      }
    }

    // Return the filename unchanged if no known suffix is found
    return fileName;
  }
}
