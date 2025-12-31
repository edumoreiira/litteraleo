import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, model, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommentReply, iComment, CreateCommentDTO } from 'app/models/comments.interface';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { CommentsService } from 'app/services/posts/comments.service';
import { TimeAgoPipe } from 'app/pipes/time-ago.pipe';
import { EditContentDropdownComponent } from "../edit-content-dropdown/edit-content-dropdown.component";
import { HasRoleDirective } from 'app/directives/auth/has-role.directive';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { ToastService } from 'app/services/ui/toast.service';
import { DialogService } from 'app/services/ui/dialog.service';

type CommentFormType = 'reply' | 'edit' | 'none';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  imports: [ButtonComponent, NewCommentComponent, DatePipe, TimeAgoPipe, EditContentDropdownComponent,
    HasRoleDirective
  ],
  animations: [createAnimation('popItem', { animateY: true, transform: 'scale(.95)'})],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  private commentService = inject(CommentsService);
  private toast = inject(ToastService);
  private dialog = inject(DialogService);
  // 
  data = model.required<iComment | CommentReply>(); // receives either a root comment or a reply
  type = input.required<'post' | 'review'>();
  resourceId = input.required<string>();
  isReply = computed(() => 'parent_id' in this.data());
  isRoot = computed(() => !this.isReply());
  deleted = output<string>(); // emits the id of the deleted comment

  // handles the list of replies separately.
  // initializes with existing replies if available in the input data, otherwise empty.
  repliesList = linkedSignal<CommentReply[]>(() => {
    const currentData = this.data();
    if ('replies' in currentData && currentData.replies) {
      return currentData.replies;
    }
    return [];
  });

  repliesCount = linkedSignal(() => {
    const currentData = this.data();
    return 'replies_count' in currentData ? currentData.replies_count : 0;
  });

  showForm = signal<CommentFormType>('none');
  loadingForm = signal(false);
  showReplies = signal(false);
  isLoadingReplies = signal(false);

  protected toggleForm(formType: CommentFormType) {
    this.showForm.update(currentType => currentType === formType ? 'none' : formType);
  }

  protected onReplySubmit(replyContent: string) {
    const payload: CreateCommentDTO = {
      content: replyContent,
      parent_id: this.data().id
    };

    if (this.type() === 'post') {
      payload.post_id = this.resourceId();
    } else {
      payload.review_id = this.resourceId();
    }

    this.loadingForm.set(true);

    this.commentService.createComment(payload)
    .then(newReply => {
      this.repliesList.update(replies => [newReply as CommentReply, ...replies]);
      this.repliesCount.update(count => count + 1);
      this.showReplies.set(true);
      this.showForm.set('none');
    })
    .catch(err => {
      this.toast.create({ variant: 'error', message: 'Erro ao enviar resposta. Tente novamente mais tarde.' });
      console.error('Erro ao enviar resposta:', err);
    })
    .finally(() => {
      this.loadingForm.set(false);
    });
  }

  protected loadReplies() {
    if (this.repliesList().length > 0) {
      // Replies already loaded
      this.showReplies.update(value => !value);
      return;
    }

    const id = this.data().id;
    // prevents loading if already loading or if not a root comment or if replies are already loaded
    if (this.isLoadingReplies() || !this.isRoot()) return;

    this.isLoadingReplies.set(true);

    this.commentService.getReplies(id)
      .then(fetchedReplies => {
        this.repliesList.set(fetchedReplies);
        this.showReplies.set(true);
      })
      .finally(() => {
        this.isLoadingReplies.set(false);
      });
  }

  // EDIT AND DELETE HANDLERS

  protected onEditSubmit(newContent: string) {
    this.loadingForm.set(true);
    this.commentService.updateComment(this.data().id, newContent)
      .then(updatedComment => {
        this.data.set(updatedComment);
        this.showForm.set('none');
        this.toast.create({ variant: 'success', message: 'Comentário atualizado com sucesso!' });
      })
      .catch(error => {
        this.toast.create({ variant: 'error', message: 'Erro ao atualizar comentário. Tente novamente mais tarde.' });
        console.error('Erro ao atualizar comentário:', error);
      })
      .finally(() => {
        this.loadingForm.set(false);
      }
    );
  }

  protected onDeleteComment() {
    this.dialog.openConfirmationDialog(
      {
        title: 'Excluir comentário',
        message: 'Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.',
        confirmText: 'Excluir',
        variant: 'destructive'
      },
      {
        onConfirm: () => { this.deleteComment(); }
      }
    );
  }
    
  private deleteComment() {
    this.commentService.deleteComment(this.data().id)
      .then(() => {
        this.toast.create({ variant: 'success', message: 'Comentário excluído com sucesso!' });
        this.deleted.emit(this.data().id);
      })
      .catch(error => {
        this.toast.create({ variant: 'error', message: 'Erro ao excluir comentário. Tente novamente mais tarde.' });
        console.error('Erro ao excluir comentário:', error);
      })
  }

  protected removeReply(deletedReplyId: string) {
    this.repliesList.update(replies => replies.filter(reply => reply.id !== deletedReplyId));
    this.repliesCount.update(count => count - 1);
  }
}