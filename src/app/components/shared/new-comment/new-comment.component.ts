import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { InputComponent } from "app/components/base/input/input.component";
import { UserProfileService } from 'app/services/api/user-profile/user-profile.service';
import { AuthService } from 'app/services/auth/auth.service';
import { AuthModalService } from 'app/services/ui/auth-modal.service';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  imports: [InputComponent, ButtonComponent],
})
export class NewCommentComponent {
  private userProfileService = inject(UserProfileService);
  private auth = inject(AuthService);
  private authModal = inject(AuthModalService);

  profile = computed(() => this.userProfileService.userProfile$() );
  type = input<'comment' | 'reply'>('comment');
  disabled = input<boolean>(false);
  comment = output<string>();


  onSubmit(comment: string) {
    if(this.auth.isLoggedIn()) {
      this.comment.emit(comment);
    } else {
      this.authModal.openLoginModal();
    }
  }
}
