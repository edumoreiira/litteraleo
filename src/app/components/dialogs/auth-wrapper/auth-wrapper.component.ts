import { ApplicationRef, ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { SignInFormComponent } from '../../forms/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from '../../forms/sign-up-form/sign-up-form.component';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { AuthService } from 'app/services/auth/auth.service';
type AuthWrapperMode = 'sign-in' | 'sign-up';
@Component({
  selector: 'app-auth-wrapper',
  imports: [SignInFormComponent, SignUpFormComponent, ButtonComponent],
  host: {
    '[class]': 'mode() === "sign-in" ? "block max-w-[300px]" : "block "',
  },
  template: `
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-semibold"
    style="view-transition-name: auth-title">{{ title() }}</h1>
    <p class="text-muted-fg"
    style="view-transition-name: auth-description">Conecte-se rapidamente com uma conta vinculada.</p>
    <div class="flex items-center gap-4"
    style="view-transition-name: auth-social-buttons">
      <button app-button variant="outline" class="flex-1 rounded-lg"
      (click)="signInWithGoogle()">
        <span class="sr-only">Entrar com o Google</span>
        <img
          src="./icons/google.png"
          alt="Ícone do Google"
          class="h-4.5 mx-auto"
        />
      </button>
      <button app-button variant="outline" class="flex-1 rounded-lg">
        <span class="sr-only">Entrar com a Apple</span>
        <img src="./icons/apple.png" alt="Ícone da Apple" class="h-4.5 mx-auto" />
      </button>
    </div>
    <div class="flex items-center gap-4 py-3"
    style="view-transition-name: auth-divider">
      <div class="h-px flex-1 bg-border"></div>
      <span class="text-muted-fg/80 font-light font-serif italic leading-none"
        >ou continue</span
      >
      <div class="h-px flex-1 bg-border"></div>
    </div>
  </div>
  @if(mode() === 'sign-in') {
    <app-sign-in-form style="view-transition-name: auth-method"/>
    <button app-button variant="link" size="sm"
    class="block mx-auto text-xs"
    style="view-transition-name: auth-change-mode"
    (click)="setMode('sign-up')">Não tem conta?</button>
  } @else if(mode() === 'sign-up') {
    <app-sign-up-form style="view-transition-name: auth-method"/>
    <button app-button variant="link" size="sm"
    style="view-transition-name: auth-change-mode"
    class="block mx-auto text-xs"
    (click)="setMode('sign-in')">Já possuo uma conta</button>
  }
  `,
  animations: [createAnimation('slide', { animateX: true, animateY: true })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthWrapperComponent implements OnInit {
  private appRef = inject(ApplicationRef);
  private auth = inject(AuthService);
  // 
  mode = signal<AuthWrapperMode | undefined>(undefined);
  initialMode = input.required<AuthWrapperMode>();
  title = computed(() => this.mode() === 'sign-in' ? 'Entrar' : 'Registrar');

  ngOnInit(): void {
    this.mode.set(this.initialMode());
  }

  setMode(newMode: AuthWrapperMode) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        this.mode.set(newMode);
        this.appRef.tick(); // Ensure the view updates after the transition
      });
    } else {
      this.mode.set(newMode);
    }
  }

  signInWithGoogle() {
    this.auth.signInWithGoogle()
  }
  
}