import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EditContentDropdownComponent } from 'app/components/shared/edit-content-dropdown/edit-content-dropdown.component';
import { HasRoleDirective } from 'app/directives/auth/has-role.directive';
import { TitleDirective } from 'app/directives/ui/title.directive';
import { Post } from 'app/models/post.interface';
import { SafeHtmlPipe } from 'app/pipes/safe-html.pipe';
import { ContentCacheService } from 'app/services/platform/content-cache.service';
import { PostService } from 'app/services/posts/post.service';
import { DialogService } from 'app/services/ui/dialog.service';
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
    </div>
  `,
  styles: `
  .no-padding { padding: 0 !important; }
  `,
  imports: [QuillModule, CommonModule, SafeHtmlPipe, TitleDirective, EditContentDropdownComponent, HasRoleDirective]
})
export class PostComponent {
  private postService = inject(PostService);
  private dialog = inject(DialogService);
  private contentCache = inject(ContentCacheService);
  private router = inject(Router);
  // 
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
  


}
