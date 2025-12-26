import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { InfiniteScrollingComponent } from 'app/components/utils/infinite-scrolling/infinite-scrolling.component';

interface YoutubeVideo {
  title: string;
  urlImage: string;
}

@Component({
  selector: 'app-youtube-videos-slider',
  imports: [InfiniteScrollingComponent],
  templateUrl: './youtube-videos-slider.component.html',
})
export class YoutubeVideosSliderComponent {
  private http = inject(HttpClient);

  youtubeVideos = signal<YoutubeVideo[]>([]);

  constructor() {
    this.http.get<YoutubeVideo[]>('/api/youtube').subscribe({
      next: (data) => {
        this.youtubeVideos.set(data);
      }
    })
  }

}
