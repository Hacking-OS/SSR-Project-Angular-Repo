import { Component, Input } from '@angular/core';
import { LoadingService } from '../../Shared-Services/Interceptor-Services/loading.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.css',
    standalone: false
})
export class LoaderComponent {
  @Input('progress') progress:number;
  @Input('status') status:string;
  ngOnInit(): void {
  }
}
