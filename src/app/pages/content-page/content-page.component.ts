import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { ReviewComponent } from 'app/components/layout/content-display/review.component';
import { Post } from 'app/models/post.interface';
import { Review } from 'app/models/review.interface';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { ToastService } from 'app/services/ui/toast.service';
import { NgTemplateOutlet } from '@angular/common';
import { PostService } from 'app/services/posts/post.service';
import { PostComponent } from 'app/components/layout/content-display/post.component';

interface Content {
  post?: Post;
  review?: Review;
  status: 'loading' | 'loaded' | 'error';
}

const INITIAL_CONTENT: Content = {
  review: undefined,
  post: undefined,
  status: 'loading'
};

@Component({
  selector: 'app-resenha',
  imports: [ReviewComponent, NgTemplateOutlet, PostComponent],
  templateUrl: './content-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class contentPageComponent implements OnInit {
  private reviewService = inject(ReviewsService);
  private postService = inject(PostService);
  private toast = inject(ToastService);
  contentType = input.required<'review' | 'post'>()
  slug = input.required<string>();
  content = signal<Content>(INITIAL_CONTENT);

  ngOnInit(): void {
    this.initializeContent();
  }

  private initializeContent() {
    if(this.contentType() === 'review') {
      this.fetchReview();
    } else {
      this.fetchPost();
    }
  }

  private fetchReview() {
    const slug = this.slug();
    if(slug) {
      this.reviewService.getReviewBySlug(slug).then(({data, error}) => {
        if (data) {
          this.content.set({...this.content(), review: data, status: 'loaded'});
        } 
        if (error) {
          console.error('Review not found');
          this.content.set({ ...this.content(), status: 'error' });
          this.toast.create({
            message: 'Não foi possível encontrar a resenha solicitada.',
            variant: 'error'
          });
          console.error(error);
        }
      })
    }
  }

  private fetchPost() {
    const slug = this.slug();
    if(slug) {
      this.postService.getPostBySlug(slug).then(({data, error}) => {
        if (data) {
          this.content.set({...this.content(), post: data, status: 'loaded'});
        } 
        if (error) {
          console.error('Post not found');
          this.content.set({ ...this.content(), status: 'error' });
          this.toast.create({
            message: 'Não foi possível encontrar o post solicitado.',
            variant: 'error'
          });
          console.error(error);
        }
      })
    }
  }

}
