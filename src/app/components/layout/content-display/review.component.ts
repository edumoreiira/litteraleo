import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit } from '@angular/core';
import { RateComponent } from 'app/components/shared/rate/rate.component';
import { TitleDirective } from 'app/directives/ui/title.directive';
import { Review } from 'app/models/review.interface';
import { SafeHtmlPipe } from 'app/pipes/safe-html.pipe';
import { ContentService } from 'app/services/posts/content.service';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'article[app-review]',
  host: {
    class: 'page-container--sm py-20 flex gap-8 items-start'
  },
  template: `
  @let review = reviewData();
    <div class="bg-muted rounded w-[185px] shrink-0 flex flex-col">
      <div class="w-full aspect-5/8 rounded p-1">
        <img class="w-full h-full object-cover rounded"
        [src]="review.book.cover_image_url" alt="Foto do livro">
      </div>
      <div class="flex flex-col gap-2 p-3">
        <div class="flex items-center gap-1">
          <app-rate [canVote]="false" [rating]="review.rating" class="text-primary gap-0.5"></app-rate>
          <span class="text-sm text-primary opacity-50">{{ review.rating || 0 }}</span>
        </div>
        <h2 class="font-serif italic font-semibold leading-none" title="{{ review.book.title }}">{{ review.book.title }}</h2>
        <span class="text-sm text-muted-fg">{{ review.book.author }}</span>
        <div class="flex gap-1.5 flex-wrap mt-4 items-start">
          @for(category of review.categories; track $index) {
            <span class="inline-block px-2 py-[.1rem] border border-zinc-300 text-zinc-500 rounded-lg text-xs font-[Lora]
            text-light italic">{{ category.name }}</span>
          }
        </div>
        <div class="text-muted-fg flex items-center gap-2" title="Número de páginas">
          <i class="fi fi-sr-book-open-cover flex"></i>
          <span class="text-sm">{{ review.book.pages }} páginas</span>
        </div>
        <div class="text-muted-fg flex items-center gap-2" title="Ano de publicação">
          <i class="fi fi-sr-calendar-lines-pen flex"></i>
          <span class="text-sm">{{ review.book.publication_year }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-8 min-w-0 w-full">
      <div class="flex flex-col gap-6">
        <h1 appTitle size="lg">{{ review.title }}</h1>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <img class="h-8 w-8 rounded-full"
              src="/icons/default_user.jpg" alt="Foto do usuário">
              <span class="text-sm text-muted-fg">{{ review.author.full_name }}</span>
            </div>
            <div class="h-1 w-1 bg-muted-fg rounded-full"></div>
            <span class="text-sm text-muted-fg">{{ review.created_at | date: "dd MMM y" }}</span>
          </div>
          <div class="flex items-center gap-4">
            <button class="flex items-center gap-1 hover:text-primary cursor-pointer"
            [ngClass]="false ? 'text-primary' : 'text-muted-fg'"
            (click)="toggle_like()">
              @if(false) {
                <i class="fi fi-sr-heart"></i>
              } @else {
                <i class="fi fi-rr-heart"></i>
              }
              <span class="text-sm">{{ review.likes_count.toString() }}</span>
            </button>
            <button class="flex items-center gap-1 text-muted-fg hover:text-primary cursor-pointer">
              <i class="fi fi-rr-arrow-up-right-from-square"></i>
            </button>
          </div>
        </div>
        <hr class="border-border/50">
      </div>
  
      <!-- <div class="flex sm:flex-row flex-col items-center bg-muted rounded sm:p-0 p-3 max-w-full">
        <div class="flex sm:flex-row flex-col items-center shrink min-w-0 max-w-full">
          <div class="h-20 aspect-5/8 rounded m-1.5 shrink-0">
            <img class="w-full h-full object-cover rounded"
            [src]="review.book.cover_image_url" alt="Foto do livro">
          </div>
            <div class="flex flex-col sm:items-start items-center min-w-0 max-w-full">
              <h2 class="font-serif italic font-semibold leading-none truncate min-w-0 max-w-full" title="{{ review.book.title }}">{{ review.book.title }}</h2>
              <span class="text-sm text-muted-fg">{{ review.book.author }}</span>
          </div>
        </div>
          <div class="flex sm:flex-row flex-col items-center my-2 mx-4 sm:gap-6 gap-2 min-w-0 min-w-fit grow">
          <div class="flex items-center gap-x-2 mx-auto">
            @for(category of review.categories; track $index) {
              <span class="text-sm text-muted-fg">{{ category.name }}</span>
              @if($index < review.categories.length - 1) {
                <div class="h-1 w-1 bg-muted-fg rounded-full"></div>
              }
            }
          </div>
          <div class="flex items-center gap-1">
            <app-rate [canVote]="false" [rating]="review.rating" class="text-primary gap-0.5"></app-rate>
            <span class="text-sm text-primary opacity-50">{{ review.rating || 0 }}</span>
          </div>
        </div>
      </div> -->
      <div class="ql-snow">
        <div class="ql-editor no-padding" [innerHTML]="review.content | safeHtml"></div>
      </div>
    </div>
  `,
  styles: `
  .no-padding { padding: 0 !important; }
  `,
  imports: [QuillModule, CommonModule, SafeHtmlPipe, RateComponent, TitleDirective]
})
export class ReviewComponent {
  private postService = inject(ContentService);

  reviewData = model.required<Review>();

  toggle_like() {
    // const post_id = this.reviewData().id;
    // this.postService.toggle_post_like(post_id).then(data => {
    //   if(data) {
    //     const new_count = data.likes_count;
    //     const new_has_liked = data.user_liked;
    //   }
    // })
  }
}
