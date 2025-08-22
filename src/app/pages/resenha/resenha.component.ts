import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RateComponent } from 'app/components/shared/rate/rate.component';
import { TitleDirective } from 'app/directives/ui/title.directive';
import { Post } from 'app/models/post.interface';
import { UserPostsService } from 'app/services/posts/user-posts.service';

@Component({
  selector: 'app-resenha',
  imports: [TitleDirective, RateComponent],
  templateUrl: './resenha.component.html',
  styleUrl: './resenha.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResenhaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(UserPostsService);
  post = signal<Post | null | undefined>(undefined);

  categories = ['Ficção', 'Fantasia', 'Aventura','Clássico'];

  ngOnInit(): void {
    this.fetchPost();
  }

  private async handleRouter(postId: string) {
    if(this.post()) {
      const title = this.sanitizeText(this.post()!.title);
      this.router.navigate(['/resenha', title, postId], {
        replaceUrl: true // substitui a URL atual no histórico
      });
    }
  }

  private async fetchPost() {
    const postId = this.route.snapshot.paramMap.get('id');
    if(postId) {
      this.postService.getPostById(postId).then(data => {
        if (data) {
          this.post.set(data)
          this.handleRouter(postId); // Atualiza a rota com o título formatado
        } else {
          console.error('Post not found');
          this.post.set(null);
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
