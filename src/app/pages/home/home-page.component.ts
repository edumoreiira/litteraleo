import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../components/base/Button/button.component';
import { TitleDirective } from '../../directives/ui/title.directive';
import { CardSlider } from "../../components/shared/card-slider/card-slider.component";
import { CardReviewComponent } from '../../components/shared/card-review/card-review.component';
import { ContentService } from 'app/services/posts/content.service';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { Review } from 'app/models/review.interface';
import { RouterLink } from '@angular/router';
import { HeroComponent } from 'app/components/layout/hero/hero.component';
import { AboutMeComponent } from 'app/components/layout/about-me/about-me.component';
import { YoutubeVideosSliderComponent } from 'app/components/shared/youtube-videos-slider/youtube-videos-slider.component';

@Component({
  selector: 'app-home',
  imports: [ButtonComponent, TitleDirective, CardSlider, CardReviewComponent,
    RouterLink, HeroComponent, AboutMeComponent, YoutubeVideosSliderComponent
  ],
  templateUrl: './home-page.component.html',
})
export class HomeComponent implements OnInit{
  private reviews = inject(ReviewsService);
  protected latestReviews = signal<Review[]>([]);

  ngOnInit(): void {
    this.fetchLatestReviews();
  }

  private fetchLatestReviews() {
    this.reviews.searchReviews({ page: 1, page_size: 5 }).then(({ data, error }) => {
      if(data) {
        this.latestReviews.set(data.reviews);
      }
    })
  }

}
