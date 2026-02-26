import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../components/base/Button/button.component';
import { TitleDirective } from '../../directives/ui/title.directive';
import { CardSlider } from "../../components/shared/card-slider/card-slider.component";
import { CardReviewComponent } from '../../components/shared/card-review/card-review.component';
import { ContentService } from 'app/services/posts/content.service';
import { Review } from 'app/models/review.interface';
import { Post } from 'app/models/post.interface';
import { RouterLink } from '@angular/router';
import { HeroComponent } from 'app/components/layout/hero/hero.component';
import { AboutMeComponent } from 'app/components/layout/about-me/about-me.component';
import { YoutubeVideosSliderComponent } from 'app/components/shared/youtube-videos-slider/youtube-videos-slider.component';

export type FeedItem = (Review & { type: 'review' }) | (Post & { type: 'post' });

@Component({
  selector: 'app-home',
  imports: [ButtonComponent, TitleDirective, CardSlider, CardReviewComponent,
    RouterLink, HeroComponent, AboutMeComponent, YoutubeVideosSliderComponent
  ],
  templateUrl: './home-page.component.html',
})
export class HomeComponent implements OnInit{
  private contentService = inject(ContentService);
  protected latestFeed = signal<FeedItem[]>([]);

  ngOnInit(): void {
    this.fetchLatestFeed();
  }

  private fetchLatestFeed() {
    this.contentService.searchContent({ page: 1, page_size: 5, search_type: 'both' }).then(({ data, error }) => {
      if(data) {
        const reviews: FeedItem[] = data.reviews.map(r => ({ ...r, type: 'review' as const }));
        const posts: FeedItem[] = data.posts.map(p => ({ ...p, type: 'post' as const }));
        
        const combined = [...reviews, ...posts]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);

        const missingCount = 5 - combined.length;
        if (missingCount > 0) { // fill with mock reviews if less than 5
          for (let i = 0; i < missingCount; i++) {
            combined.push(this.createMockReview(i));
          }
        }
        this.latestFeed.set(combined);
      } else {
        const mockReviews: FeedItem[] = [];
        for (let i = 0; i < 5; i++) {
          mockReviews.push(this.createMockReview(i));
        }
        this.latestFeed.set(mockReviews);
      }
    })
  }

  private createMockReview(index: number): FeedItem {
    return {
      type: 'review',
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

  getCoverImage(item: FeedItem): string {
    return item.type === 'review' ? item.book.cover_image_url : '';
  }

  getBookAuthor(item: FeedItem): string {
    return item.type === 'review' ? item.book.author : '';
  }

  getRating(item: FeedItem): number {
    return item.type === 'review' ? item.rating : 0;
  }

  getUrl(item: FeedItem): string[] {
    return item.type === 'review' ? ['/resenha/', item.slug] : ['/post/', item.slug];
  }

}
