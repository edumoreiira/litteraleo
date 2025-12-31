import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Component, computed, inject, input, OnInit, output, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { PopOverDirective } from 'app/directives/utils/pop-over.directive';
import { A11yModule } from '@angular/cdk/a11y';
import { AuthService } from 'app/services/auth/auth.service';
import { UserProfileService } from 'app/services/api/user-profile/user-profile.service';
import { ModalService } from 'app/services/ui/modal.service';
import { UpdateUserFormComponent } from 'app/components/forms/update-user-form/update-user-form.component';

@Component({
  selector: 'app-user-icon',
  template: `
    <img class="w-10 h-10 rounded-full object-cover cursor-pointer overflow-hidden border border-border
    hover:ring-2 hover:ring-primary transition-all"
    [src]="imgUrl()" alt="Ícone com avatar do usuário" aria-haspopup="menu"
    [popOver]="options"
    />

    <ng-template #options>
      <ul role="menu" @popConfig cdkTrapFocus [cdkTrapFocusAutoCapture]="true"
      aria-label="Menu de opções do usuário"
      class="bg-popover rounded border border-border shadow-xs min-w-[13rem] max-w-[15rem] overflow-hidden overflow-ellipsis">
        <li role="none" class="p-4 pb-2">
          <span class="block leading-none">{{ username() }}</span>
          <span class="text-sm text-muted-fg leading-none wrap-anywhere">{{ email() }}</span>
        </li>
        <li role="none" class="h-px bg-border"></li>
        <li role="none" class="p-1 pb-0">
          <button role="menuitem"
          class="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-accent focus:bg-accent outline-none"
          (click)="onEditProfile()">
            <i class="fi fi-rr-circle-user"></i>
            Editar perfil
          </button>
        </li>
        <li role="none" class="p-1 pt-0">
          <button role="menuitem"
          class="flex w-full items-center text-destructive gap-2 rounded-lg px-3 py-1.5 hover:bg-accent focus:bg-accent outline-none"
          aria-label="Sair da conta"
          (click)="logout()">
            <i class="fi fi-rr-sign-out-alt"></i>
            <span aria-hidden="true">Sair</span>
          </button>
        </li>
      </ul>
    </ng-template>
    
  `,
  imports: [PopOverDirective, CdkOverlayOrigin, A11yModule],
  animations: [createAnimation('popConfig', { transform: 'scale(.95)', duration: '100ms' })],
})
export class UserIconComponent {
  private userProfile = inject(UserProfileService);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  // 
  protected readonly imgUrl = computed(() => this.userProfile.userProfile$()?.avatar_url || 'icons/default_user.jpg');
  protected readonly username = computed(() => this.userProfile.userProfile$()?.full_name);
  protected readonly email = computed(() => this.authService.$currentUser()?.email);
  private popOver = viewChild(PopOverDirective);

  protected logout() {
    this.popOver()?.close();
    this.authService.logout();
  }

  protected onEditProfile() {
    this.popOver()?.close();
    this.modalService.open(UpdateUserFormComponent, { role: 'alertdialog' })
  }


}
