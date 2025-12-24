import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit } from '@angular/core';
import { RateComponent } from 'app/components/shared/rate/rate.component';
import { TitleDirective } from 'app/directives/ui/title.directive';
import { Post } from 'app/models/post.interface';
import { SafeHtmlPipe } from 'app/pipes/safe-html.pipe';
import { ContentService } from 'app/services/posts/content.service';
import { PostService } from 'app/services/posts/post.service';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'article[app-post]',
  host: {
    class: 'page-container--xs py-20'
  },
  template: `
  @let post = postData();
    <div class="flex flex-col gap-8 min-w-0 w-full">
      <div class="flex flex-col gap-6">
        <h1 appTitle size="lg">{{ post.title }}</h1>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <img class="h-8 w-8 rounded-full"
              src="/icons/default_user.jpg" alt="Foto do usuário">
              <span class="text-sm text-muted-fg">{{ post.author.full_name }}</span>
            </div>
            <div class="h-1 w-1 bg-muted-fg rounded-full"></div>
            <span class="text-sm text-muted-fg">{{ post.created_at | date: "dd MMM y" }}</span>
          </div>
          <div class="flex items-center gap-4">
            <button class="flex items-center gap-1 hover:text-primary cursor-pointer"
            [ngClass]="post.is_liked ? 'text-primary' : 'text-muted-fg'"
            (click)="toggleLike()">
              @if(post.is_liked) {
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
        <hr class="border-border/50">
      </div>
      <div class="ql-snow">
        <div class="ql-editor no-padding" [innerHTML]="post.content | safeHtml"></div>
      </div>
    </div>
  `,
  styles: `
  .no-padding { padding: 0 !important; }
  `,
  imports: [QuillModule, CommonModule, SafeHtmlPipe, TitleDirective]
})
export class PostComponent {
  private postService = inject(PostService);

  postData = model.required<Post>();

  protected toggleLike() {
    this.postService.toggleLike(this.postData().id).then(data => {
      this.postData.update(current => {
        return {
          ...current,
          likes_count: data.likes_count,
          is_liked: data.is_liked
        }
      })
    })
  }
}
