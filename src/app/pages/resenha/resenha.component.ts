import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewComponent } from 'app/components/layout/post/review.component';
import { Post } from 'app/models/post.interface';
import { Review } from 'app/models/review.interface';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { UserPostsService } from 'app/services/posts/user-posts.service';

@Component({
  selector: 'app-resenha',
  imports: [ReviewComponent],
  templateUrl: './resenha.component.html',
  styleUrl: './resenha.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResenhaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reviewService = inject(ReviewsService);
  review = signal<Review | null | undefined>(undefined);

  categories = ['Ficção', 'Fantasia', 'Aventura','Clássico'];

  ngOnInit(): void {
    this.fetchPost();
  }

  private async handleRouter(slug: string) {
    if(this.review()) {
      // const title = this.sanitizeText(this.post()!.title);
      this.router.navigate(['/resenha', slug], {
        replaceUrl: true // substitui a URL atual no histórico
      });
    }
  }

  private async fetchPost() {
    const postSlug = this.route.snapshot.paramMap.get('slug');
    if(postSlug) {
      this.reviewService.getReviewBySlug(postSlug).then(({data, error}) => {
        if (data) {
          this.review.set(data)
          this.handleRouter(data.slug); // Atualiza a rota com o título formatado
        } else {
          console.error('Post not found');
          this.review.set(null);
        }
      }).catch(error => {
        console.error('Error fetching post:', error);
      });
    }
  }

  private sanitizeText(text: string) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^a-zA-Z0-9\s-]/g, '') // remove caracteres especiais
        .replace(/\s+/g, '-')
        .toLowerCase();
  }




}
