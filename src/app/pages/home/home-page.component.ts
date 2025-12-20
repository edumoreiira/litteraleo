import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../components/base/Button/button.component';
import { TitleDirective } from '../../directives/ui/title.directive';
import { TextDirective } from '../../directives/ui/text.directive';
import { CardSlider } from "../../components/shared/card-slider/card-slider.component";
import { CardReviewComponent } from '../../components/shared/card-review/card-review.component';
import { RecommendationCardComponent } from "../../components/layout/recommendation-card/recommendation-card.component";
import { ContentService } from 'app/services/posts/content.service';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { Review } from 'app/models/review.interface';
import { RouterLink } from '@angular/router';
import { HeroComponent } from 'app/components/layout/hero/hero.component';

@Component({
  selector: 'app-home',
  imports: [ButtonComponent, TitleDirective, TextDirective, CardSlider, CardReviewComponent, RecommendationCardComponent,
    RouterLink, HeroComponent
  ],
  templateUrl: './home-page.component.html',
})
export class HomeComponent implements OnInit{
  private posts = inject(ContentService);
  private reviews = inject(ReviewsService);
  protected latestReviews = signal<Review[]>([]);

  ngOnInit(): void {
    this.getLatestPosts();
  }

  private getLatestPosts() {
    // this.posts.searchPostsPage({ page: 1, pageSize: 5}).then(({ data, error}) => {
    //   if(data) {
    //     this.latestPosts.set(data.posts);
    //   }
    // })
    this.reviews.searchReviews({ page: 1, page_size: 5 }).then(({ data, error }) => {
      if(data) {
        this.latestReviews.set(data.reviews);
      }
    })
  }

}
