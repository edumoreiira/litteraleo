import { Component, computed, inject, signal } from '@angular/core';
import { InfiniteScrollingComponent } from 'app/components/utils/infinite-scrolling/infinite-scrolling.component';
import { YoutubeService } from 'app/services/api/youtube/youtube.service';


@Component({
  selector: 'app-youtube-videos-slider',
  imports: [InfiniteScrollingComponent],
  templateUrl: './youtube-videos-slider.component.html',
})
export class YoutubeVideosSliderComponent {
  private youtubeService = inject(YoutubeService);
  latestVideos = computed(() => this.youtubeService.latestVideos);

  // youtubeVideos = signal<YoutubeVideo[]>([]);

}
