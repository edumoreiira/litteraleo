import { Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { InputComponent } from 'app/components/base/input/input.component';
import { UpdateUserProfileDTO } from 'app/models/user.interface';
import { UserProfileService } from 'app/services/api/user-profile/user-profile.service';
import { ToastService } from 'app/services/ui/toast.service';

@Component({
  selector: 'app-update-user-form',
  host: {
    class: 'flex flex-col gap-7'
  },
  imports: [ButtonComponent, InputComponent, FormsModule],
  templateUrl: './update-user-form.component.html',
})
export class UpdateUserFormComponent  {
  private userProfileService = inject(UserProfileService);
  private toast = inject(ToastService);
  // 
  full_name = linkedSignal(() => this.userProfileService.userProfile$()?.full_name || '');
  user_avatar_url = linkedSignal(() => this.userProfileService.userProfile$()?.avatar_url || 'icons/default_user.jpg');
  user_avatar_file = signal<File | null>(null);

  invalid_form = computed(() => {
    return this.full_name() === this.userProfileService.userProfile$()?.full_name && !this.user_avatar_file();
  });

  

  protected onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
    if(!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/webp')) {
      this.toast.create({
        variant: 'error',
        message: 'Por favor, selecione uma imagem válida (JPEG, PNG ou WEBP).',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      this.user_avatar_file.set(file);
      this.user_avatar_url.set(reader.result as string);
    }
    reader.readAsDataURL(file);
  }

  protected onSubmit() {
    if (this.invalid_form()) return;

    const payload: UpdateUserProfileDTO = {
      id: this.userProfileService.userProfile$()?.id || '',
      full_name: this.full_name(),
    };
    const avatarFile = this.user_avatar_file();

    this.userProfileService.updateUserProfile(payload, avatarFile ?? undefined).then((data) => {
      if (data) {
        this.toast.create({
          variant: 'success',
          message: 'Perfil atualizado com sucesso!',
        });
        this.user_avatar_file.set(null);
      }
    });
  }
    
}
