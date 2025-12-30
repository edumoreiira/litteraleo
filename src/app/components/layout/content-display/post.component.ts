import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, model, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommentComponent } from 'app/components/shared/comment/comment.component';
import { EditContentDropdownComponent } from 'app/components/shared/edit-content-dropdown/edit-content-dropdown.component';
import { NewCommentComponent } from 'app/components/shared/new-comment/new-comment.component';
import { HasRoleDirective } from 'app/directives/auth/has-role.directive';
import { TitleDirective } from 'app/directives/ui/title.directive';
import { iComment } from 'app/models/comments.interface';
import { Post } from 'app/models/post.interface';
import { SafeHtmlPipe } from 'app/pipes/safe-html.pipe';
import { AuthService } from 'app/services/auth/auth.service';
import { ContentCacheService } from 'app/services/platform/content-cache.service';
import { CommentsService } from 'app/services/posts/comments.service';
import { PostService } from 'app/services/posts/post.service';
import { AuthModalService } from 'app/services/ui/auth-modal.service';
import { DialogService } from 'app/services/ui/dialog.service';
import { QuillModule } from 'ngx-quill';
import { CommentsSectionComponent } from "../comments-section/comments-section.component";

@Component({
  selector: 'article[app-post]',
  host: {
    class: 'page-container--xs py-20'
  },
  template: `
  @let post = postData();
    <div class="flex flex-col gap-8 min-w-0 w-full">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-3.5">
          <h1 appTitle size="lg">{{ post.title }}</h1>
          @if(post.description) {
            <p class="text-muted-fg text-lg sm:text-xl">{{ post.description }}</p>
          }
        </div>
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <img class="h-8 w-8 rounded-full"
              [src]="post.author.avatar_url || '/icons/default_user.jpg'" [alt]="'Foto do usuário ' + post.author.full_name">
              <span class="text-sm text-muted-fg">{{ post.author.full_name }}</span>
            </div>
            <div class="h-1 w-1 bg-muted-fg shrink-0 rounded-full"></div>
            <span class="text-sm text-muted-fg">{{ post.created_at | date: "dd MMM y" }}</span>
          </div>
          <div class="flex items-center gap-4">
            <button class="flex items-center gap-1 hover:text-primary cursor-pointer"
            [ngClass]="post.is_liked ? 'text-primary' : 'text-muted-fg'"
            (click)="handleLike()">
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
            <app-edit-content-dropdown *appHasRole="['admin', 'writer']"
            (delete)="onDelete()"
            (edit)="onEdit()"
            />
          </div>
        </div>
        <hr class="border-border/50">
      </div>
      <div class="ql-snow">
        <div class="ql-editor no-padding" [innerHTML]="post.content | safeHtml"></div>
      </div>
      <app-comments-section
      type="post"
      [postId]="post.id"
      />
    </div>
  `,
  styles: `
  .no-padding { padding: 0 !important; }
  `,
  imports: [QuillModule, CommonModule, SafeHtmlPipe, TitleDirective, EditContentDropdownComponent, HasRoleDirective,
  CommentsSectionComponent]
})
export class PostComponent {
  private postService = inject(PostService);
  private dialog = inject(DialogService);
  private contentCache = inject(ContentCacheService);
  private router = inject(Router);
  private authModal = inject(AuthModalService);
  private auth = inject(AuthService);
  // 
  postData = model.required<Post>();
  protected handleLike() {
    const isUserLoggedIn = !!this.auth.isLoggedIn();
    if(!isUserLoggedIn) {
      this.openLoginModal();
      return;
    }
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
  
  protected onDelete() {
    this.dialog.openConfirmationDialog({
      title: 'Excluir postagem',
      message: `Tem certeza que deseja excluir a postagem: "${this.postData().title}"? Esta ação não pode ser desfeita.`,
      variant: 'destructive',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    },
    {
      onConfirm: () => {
        this.postService.deletePost(this.postData().id).then(() => {
          this.contentCache.clear();
          this.router.navigate(['/resenhas']);
        });
      }
    });
  }


  protected onEdit() {
    this.router.navigate(['/editar-post', this.postData().slug]);
  }

  protected openLoginModal() {
    this.authModal.openLoginModal();
  }
  


}
