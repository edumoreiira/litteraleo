import { Component } from '@angular/core';
import { InfiniteScrollingComponent } from 'app/components/utils/infinite-scrolling/infinite-scrolling.component';
import { SafeHtmlPipe } from 'app/pipes/safe-html.pipe';

@Component({
  selector: 'app-youtube-videos-slider',
  imports: [InfiniteScrollingComponent, SafeHtmlPipe],
  templateUrl: './youtube-videos-slider.component.html',
})
export class YoutubeVideosSliderComponent {

  youtubeMockData = [
    { title: 'Video 1', urlImg: 'https://i.ytimg.com/vi/dLO6eYxrgWQ/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLATcB78F-u-g84W98-y_F2KXyyXmg' },
    { title: 'Video 2', urlImg: 'https://i.ytimg.com/vi/BM2kYUsgGn4/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBtVaDLIJZbb630_YTIjLEjmFP34g' },
    { title: 'Video 3', urlImg: 'https://i.ytimg.com/vi/J7xZfthggJg/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA-NF9y271UrHWlDBDDQf8YBsvaVA' },
    { title: 'Video 4', urlImg: 'https://i.ytimg.com/vi/dLO6eYxrgWQ/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLATcB78F-u-g84W98-y_F2KXyyXmg' },
    { title: 'Video 5', urlImg: 'https://i.ytimg.com/vi/BM2kYUsgGn4/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBtVaDLIJZbb630_YTIjLEjmFP34g' },
  ];

}
