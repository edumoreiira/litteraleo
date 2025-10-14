import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit } from '@angular/core';
import { RateComponent } from 'app/components/shared/rate/rate.component';
import { TitleDirective } from 'app/directives/ui/title.directive';
import { Post } from 'app/models/post.interface';
import { SafeHtmlPipe } from 'app/pipes/safe-html-pipe';
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'article[app-post]',
  host: {
    class: 'page-container--xs pt-20'
  },
  template: `
  @let post = postData();
    <div class="flex flex-col gap-8">
      <h1 appTitle size="lg">{{ post.title }}</h1>
  
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <img class="h-8 w-8 rounded-full"
            src="/icons/default_user.jpg" alt="Foto do usuário">
            <span class="text-sm text-muted-fg">{{ post.full_name }}</span>
          </div>
          <div class="h-1 w-1 bg-muted-fg rounded-full"></div>
          <span class="text-sm text-muted-fg">{{ post.created_at | date: "dd MMM y" }}</span>
        </div>
        <div class="flex items-center gap-4">
          <button class="flex items-center gap-1 hover:text-primary cursor-pointer"
          [ngClass]="post.has_liked ? 'text-primary' : 'text-muted-fg'"
          (click)="toggle_like()">
            @if(post.has_liked) {
              <i class="fi fi-sr-heart"></i>
            } @else {
              <i class="fi fi-rr-heart"></i>
            }
            <span class="text-sm">{{ post.likes_count.toString() }}</span>
          </button>
          <button class="flex items-center gap-1 text-muted-fg hover:text-primary cursor-pointer">
            <i class="fi fi-rr-arrow-up-right-from-square"></i>
          </button>
        </div>
        
      </div>
  
      <div class="flex sm:flex-row flex-col items-center bg-muted rounded sm:p-0 p-3">
  <div class="flex sm:flex-row flex-col items-center shrink min-w-0 max-w-full">
          <div class="h-12 w-12 rounded m-1.5 shrink-0">
            <img class="h-12 w-12 object-cover rounded"
            src="/books/senhor_dos_aneis.jpg" alt="Foto do livro">
          </div>
            <div class="flex flex-col sm:items-start items-center min-w-0 max-w-full">
              <h2 class="font-serif italic font-semibold leading-none truncate min-w-0 max-w-full" title="{{ post.book_name }}">{{ post.book_name }}</h2>
              <span class="text-sm text-muted-fg">{{ post.book_author }}</span>
          </div>
        </div>
          <div class="flex sm:flex-row flex-col items-center my-2 mx-4 sm:gap-6 gap-2 min-w-0 min-w-fit grow">
          <div class="flex items-center gap-x-2 mx-auto">
            @for(category of post.categories; track $index) {
              <span class="text-sm text-muted-fg">{{ category.name }}</span>
              @if($index < post.categories.length - 1) {
                <div class="h-1 w-1 bg-muted-fg rounded-full"></div>
              }
            }
          </div>
          <div class="flex items-center gap-1">
            <app-rate [canVote]="false" [rating]="post.rate" class="text-primary gap-0.5"></app-rate>
            <span class="text-sm text-primary opacity-50">{{ post.rate || 0 }}</span>
          </div>
        </div>
      </div>
      <div class="ql-snow">
        <div class="ql-editor no-padding" [innerHTML]="post.content | safeHtml"></div>
      </div>
    </div>
  
  `,
  styles: `
  .no-padding { padding: 0 !important; }
  `,
  imports: [QuillModule, CommonModule, SafeHtmlPipe, RateComponent, TitleDirective]
})
export class PostComponent {
  private postService = inject(UserPostsService);

  postData = model.required<Post>();

  toggle_like() {
    const post_id = this.postData().id;
    this.postService.toggle_post_like(post_id).then(data => {
      if(data) {
        const new_count = data.likes_count;
        const new_has_liked = data.user_liked;
        this.postData.update(value => {
          const new_post: Post = {
            ...value,
            has_liked: new_has_liked,
            likes_count: new_count
          };
          return new_post;
        })
      }
    })
  }
}
