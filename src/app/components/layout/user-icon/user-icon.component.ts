import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Component, input, OnInit, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { PopOverDirective } from 'app/directives/utils/pop-over.directive';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-user-icon',
  template: `
    <img class="w-10 h-10 rounded-full object-cover cursor-pointer
    hover:ring-2 hover:ring-primary transition-all"
    [src]="imgUrl()" alt="Ícone com avatar do usuário" aria-haspopup="menu"
    [popOver]="options"
    />

    <ng-template #options>
      <ul role="menu" @popConfig cdkTrapFocus
      aria-label="Menu de opções do usuário"
      class="bg-popover rounded border border-border shadow-xs min-w-[13rem] max-w-[15rem] overflow-hidden overflow-ellipsis">
        <li role="none" class="p-4 pb-2">
          <span class="block leading-none">Jeckwilke</span>
          <span class="text-sm text-muted-fg leading-none wrap-anywhere">eduuardomoreira9&#64;gmail.com</span>
        </li>
        <li role="none" class="h-px bg-border"></li>
        <li role="none" class="p-1 pb-0">
          <a role="menuitem" routerLink="/configuracoes" 
          class="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-accent focus:bg-accent">
            <i class="fi fi-rr-circle-user"></i>
            Configurar perfil
          </a>
        </li>
        <li role="none" class="p-1 pt-0">
          <button role="menuitem"
          class="flex w-full cursor-pointer items-center text-destructive gap-2 rounded-lg px-3 py-1.5 hover:bg-accent focus:bg-accent"
          aria-label="Sair da conta"
          (click)="logout.emit()">
            <i class="fi fi-rr-sign-out-alt"></i>
            <span aria-hidden="true">Sair</span>
          </button>
        </li>
      </ul>
    </ng-template>
    
  `,
  imports: [PopOverDirective, CdkOverlayOrigin, RouterLink, A11yModule],
  animations: [createAnimation('popConfig', { transform: 'scale(.95)', duration: '100ms' })],
})
export class UserIconComponent {
  readonly imgUrl = input('');
  logout = output<void>();

}
