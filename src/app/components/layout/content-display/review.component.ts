import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { Router } from '@angular/router';
import { EditContentDropdownComponent } from 'app/components/shared/edit-content-dropdown/edit-content-dropdown.component';
import { RateComponent } from 'app/components/shared/rate/rate.component';
import { HasRoleDirective } from 'app/directives/auth/has-role.directive';
import { TitleDirective } from 'app/directives/ui/title.directive';
import { Review } from 'app/models/review.interface';
import { SafeHtmlPipe } from 'app/pipes/safe-html.pipe';
import { AuthService } from 'app/services/auth/auth.service';
import { ContentCacheService } from 'app/services/platform/content-cache.service';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { AuthModalService } from 'app/services/ui/auth-modal.service';
import { DialogService } from 'app/services/ui/dialog.service';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'article[app-review]',
  host: {
    class: 'page-container--sm py-20 flex sm:flex-row flex-col gap-8 items-start'
  },
  template: `
  @let review = reviewData();
    <div class="bg-muted rounded sm:w-[185px] w-full shrink-0 flex sm:flex-col flex-row">
      <div class="sm:w-full w-[120px] shrink-0 aspect-5/8 rounded p-1">
        <img class="w-full h-full object-cover rounded"
        [src]="review.book.cover_image_url" alt="Foto do livro">
      </div>
      <div class="flex flex-col gap-2 p-3">
        <div class="flex items-center gap-1">
          <app-rate [canVote]="false" [rating]="review.rating" class="text-primary gap-0.5"></app-rate>
          <span class="text-sm text-primary opacity-50">{{ review.rating || 0 }}</span>
        </div>
        <h2 class="font-semibold leading-none" title="{{ review.book.title }}">{{ review.book.title }}</h2>
        <span class="text-sm text-muted-fg">{{ review.book.author }}</span>
        <div class="flex gap-1.5 flex-wrap mt-4 items-start">
          @for(category of review.categories; track $index) {
            <span class="inline-block px-2 py-[.1rem] border border-zinc-300 text-zinc-500 rounded-lg text-xs font-serif
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
        <div class="flex flex-col gap-3.5">
          <h1 appTitle size="lg">{{ review.title }}</h1>
          @if(review.description) {
            <p class="text-muted-fg text-lg sm:text-xl">{{ review.description }}</p>
          }
        </div>
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <img class="h-8 w-8 rounded-full"
              [src]="review.author.avatar_url || '/icons/default_user.jpg'" [alt]="'Foto do usuário ' + review.author.full_name">
              <span class="text-sm text-muted-fg">{{ review.author.full_name }}</span>
            </div>
            <div class="h-1 w-1 bg-muted-fg rounded-full shrink-0"></div>
            <span class="text-sm text-muted-fg min-w-fit">{{ review.created_at | date: "dd MMM y" }}</span>
          </div>
          <div class="flex items-center gap-4">
            <button class="flex items-center gap-1 hover:text-primary cursor-pointer"
            [ngClass]="review.is_liked ? 'text-primary' : 'text-muted-fg'"
            (click)="handleLike()">
              @if(review.is_liked) {
                <i class="fi fi-sr-heart"></i>
              } @else {
                <i class="fi fi-rr-heart"></i>
              }
              <span class="text-sm">{{ review.likes_count.toString() }}</span>
            </button>
            <button class="flex items-center gap-1 text-muted-fg hover:text-primary cursor-pointer">
              <i class="fi fi-rr-arrow-up-right-from-square"></i>
            </button>
            <app-edit-content-dropdown *appHasRole="['admin', 'writer']"
            (delete)="onDelete()"
            (edit)="onEdit()"
            />
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
  imports: [QuillModule, CommonModule, SafeHtmlPipe, RateComponent, TitleDirective, HasRoleDirective,
     EditContentDropdownComponent]
})
export class ReviewComponent {
  private reviewService = inject(ReviewsService);
  private dialog = inject(DialogService);
  private contentCache = inject(ContentCacheService);
  private router = inject(Router);
  private authModal = inject(AuthModalService);
  private auth = inject(AuthService);
  //
  reviewData = model.required<Review>();

  protected handleLike() {
    const isUserLoggedIn = this.auth.isLoggedIn();
    if(!isUserLoggedIn) {
      this.authModal.openLoginModal();
      return;
    }
    this.reviewService.toggleLike(this.reviewData().id).then(data => {
      this.reviewData.update(current => {
        return {
          ...current,
          likes_count: data.likes_count,
          is_liked: data.is_liked
        }
      })
    })
  }

  protected onDelete() {
    this.dialog.openConfirmationDialog({
      title: 'Excluir resenha',
      message: `Tem certeza que deseja excluir a resenha: "${this.reviewData().title}"? Esta ação não pode ser desfeita.`,
      variant: 'destructive',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    },
    {
      onConfirm: () => {
        this.reviewService.deleteReview(this.reviewData().id).then(() => {
          this.contentCache.clear();
          this.router.navigate(['/resenhas']);
        });
      }
    });
  }

  protected onEdit() {
    this.router.navigate(['/editar-resenha', this.reviewData().slug]);
  }
}
