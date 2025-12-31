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
  private contentService = inject(ContentService);
  protected latestReviews = signal<Review[]>([]);

  ngOnInit(): void {
    this.fetchLatestReviews();
  }

  private fetchLatestReviews() {
    this.contentService.searchContent({ page: 1, page_size: 5, search_type: 'reviews' }).then(({ data, error }) => {
      if(data) {
        const reviews = [...data.reviews];
        const missingCount = 5 - reviews.length;
        if (missingCount > 0) { // fill with mock reviews if less than 5
          for (let i = 0; i < missingCount; i++) {
            reviews.push(this.createMockReview(i));
          }
        }
        this.latestReviews.set(reviews);
      } else {
        const mockReviews: Review[] = [];
        for (let i = 0; i < 5; i++) {
          mockReviews.push(this.createMockReview(i));
        }
        this.latestReviews.set(mockReviews);
      }
    })
  }

  private createMockReview(index: number): Review {
    return {
      id: `mock-${index}`,
      slug: 'mock-review',
      title: 'Resenha Misteriosa',
      rating: 0,
      content: '',
      description: 'Essa resenha ainda não foi escrita. Em breve, novidades!',
      author: {
        short_name: 'Sistema',
        full_name: 'Litteraleo',
        avatar_url: ''
      },
      book: {
        id: 0,
        title: 'Livro Indisponível',
        author: 'Desconhecido',
        cover_image_url: '',
        pages: 0,
        publication_year: new Date().getFullYear()
      },
      likes_count: 0,
      categories: [],
      created_at: new Date(),
      updated_at: null
    };
  }

}
