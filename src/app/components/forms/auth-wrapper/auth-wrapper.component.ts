import { Component, computed, input, OnInit, signal } from '@angular/core';
import { SignInFormComponent } from '../sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from '../sign-up-form/sign-up-form.component';
import { ButtonComponent } from 'app/components/base/Button/button.component';
type AuthWrapperMode = 'sign-in' | 'sign-up';
@Component({
  selector: 'app-auth-wrapper',
  imports: [SignInFormComponent, SignUpFormComponent, ButtonComponent],
  host: {
    '[class]': 'mode() === "sign-in" ? "block max-w-[300px]" : "block "',
  },
  template: `
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-semibold">{{ title() }}</h1>
    <p class="text-muted-fg">Conecte-se rapidamente com uma conta vinculada.</p>
    <div class="flex items-center gap-4">
      <button app-button variant="outline" class="flex-1 rounded-lg">
        <img
          src="./icons/google.png"
          alt="Ícone do Google"
          class="h-4.5 mx-auto"
        />
      </button>
      <button app-button variant="outline" class="flex-1 rounded-lg">
        <img src="./icons/apple.png" alt="Ícone da Apple" class="h-4.5 mx-auto" />
      </button>
    </div>
    <div class="flex items-center gap-4 py-3">
      <div class="h-px flex-1 bg-border"></div>
      <span class="text-muted-fg/80 font-light font-serif italic leading-none"
        >ou continue</span
      >
      <div class="h-px flex-1 bg-border"></div>
    </div>
  </div>
  @if(mode() === 'sign-in') {
    <app-sign-in-form></app-sign-in-form>
    <button app-button variant="link" size="sm"
    class="block mx-auto"
    (click)="mode.set('sign-up')">Não tem conta?</button>
  } @else if(mode() === 'sign-up') {
    <app-sign-up-form></app-sign-up-form>
    <button app-button variant="link" size="sm"
    class="block mx-auto"
    (click)="mode.set('sign-in')">Já possuo uma conta</button>
  }
  `,
})
export class AuthWrapperComponent implements OnInit {
  mode = signal<AuthWrapperMode | undefined>(undefined);
  initialMode = input.required<AuthWrapperMode>();
  title = computed(() => this.mode() === 'sign-in' ? 'Entrar' : 'Registrar');

  ngOnInit(): void {
    this.mode.set(this.initialMode());
  }
  
}