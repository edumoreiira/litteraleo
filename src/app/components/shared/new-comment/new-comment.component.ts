import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { InputComponent } from "app/components/base/input/input.component";
import { UserProfileService } from 'app/services/api/user-profile/user-profile.service';
import { AuthService } from 'app/services/auth/auth.service';
import { AuthModalService } from 'app/services/ui/auth-modal.service';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-new-comment',
  host: {
    class: 'rounded flex flex-col gap-6 p-4 bg-muted'
  },
  templateUrl: './new-comment.component.html',
  imports: [InputComponent, ButtonComponent, FormsModule],
})
export class NewCommentComponent implements OnInit {
  private userProfileService = inject(UserProfileService);
  private auth = inject(AuthService);
  private authModal = inject(AuthModalService);

  profile = computed(() => this.userProfileService.userProfile$() );
  initialValue = input<string>('');
  protected value = signal<string>('');
  type = input<'comment' | 'reply' | 'edit'>('comment');
  disabled = input<boolean>(false);
  comment = output<string>();

  disabledForm = computed(() => this.disabled() || this.value().length === 0 || this.initialValue() === this.value());

  ngOnInit(): void {
    this.value.set(this.initialValue());
  }

  onSubmit() {
    if(this.disabledForm()) return;
    
    if(this.auth.isLoggedIn()) {
      this.comment.emit(this.value());
    } else {
      this.authModal.openLoginModal();
    }
  }

  clear() {
    this.value.set('');
  }
}
