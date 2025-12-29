import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommentReply, iComment } from 'app/models/comments.interface';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { CommentsService } from 'app/services/posts/comments.service';
import { TimeAgoPipe } from 'app/pipes/time-ago.pipe';
import { EditContentDropdownComponent } from "../edit-content-dropdown/edit-content-dropdown.component";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  imports: [ButtonComponent, NewCommentComponent, DatePipe, TimeAgoPipe, EditContentDropdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  private commentService = inject(CommentsService);
  data = input.required<iComment | CommentReply>(); // receives either a root comment or a reply
  isReply = computed(() => 'parent_id' in this.data());
  isRoot = computed(() => 'replies_count' in this.data());

  // handles the list of replies separately.
  // initializes with existing replies if available in the input data, otherwise empty.
  repliesList = linkedSignal<CommentReply[]>(() => {
    const currentData = this.data();
    if ('replies' in currentData && currentData.replies) {
      return currentData.replies;
    }
    return [];
  });

  repliesCount = computed(() => {
    const currentData = this.data();
    return 'replies_count' in currentData ? currentData.replies_count : 0;
  });

  showReplyForm = signal(false);
  showReplies = signal(false);
  isLoadingReplies = signal(false);

  protected toggleReplyForm() {
    this.showReplyForm.update(value => !value);
  }

  protected onReplySubmit(replyContent: string) {
    // TODO: implement reply submission logic
    console.log('reply submitted:', replyContent);
    this.showReplyForm.set(false);
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
}