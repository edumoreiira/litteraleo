import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../../../services/ui/toast.service';
import { Toast } from 'app/models/toast.interface';
import { createQueryAnimations } from 'app/angular-animations/animations.utils';

const toastAnimation = trigger('toastAnimation', [
  state('void', style({
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
    height: 0,
    minHeight: 0,
    opacity: 0
  })),
  transition(':enter', [
    animate('250ms ease-in-out')
  ]),
  transition(':leave', [
    animate('150ms ease-in', style( {
      transform: 'translateX(100%)',
      opacity: 0,
    })),
    animate('150ms ease-out', style({
      height: 0,
      minHeight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      marginBottom: 0
    }))
  ])
])

@Component({
  selector: 'toast',
  standalone: true,
  imports: [CommonModule],
  host: { '[@queryAnimationToast]': '' },
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    toastAnimation,
    createQueryAnimations('queryAnimationToast', '@toastAnimation'),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  protected toastService = inject(ToastService);
  protected toasts = this.toastService.$toasts;
  private timeoutIds: { [key: string]: any } = {}; // object to store toast timeouts based on toast id

  constructor() {
    effect(() => {
      const recentToast = this.toasts()[this.toasts().length - 1]; // gets the last toast in the array
      if (recentToast) {
        this.startDismissTimer(recentToast); // starts the dismiss timer for the toast
      }
    })
  }

  private startDismissTimer(toast: Toast) {
    const duration = toast.duration || 8000;
    if (this.timeoutIds[toast.id!]) { // checks if the toast already has a timeout set, if so, it doesn't set another one
      return;
    }
    this.timeoutIds[toast.id!] = setTimeout(() => {
      toast.isVisible = false; // sets the toast to invisible to trigger the animation
      setTimeout(() => {
        this.toastService.removeToast(toast);
        delete this.timeoutIds[toast.id!];
      }, 300); // removes from array after animation is complete
    }, duration);
  }

  pauseToast(toast: Toast) {
    clearTimeout(this.timeoutIds[toast.id!]); // clears the timeout for the selected toast
    delete this.timeoutIds[toast.id!]; // deletes the timeout id from the object
  }

  resumeToast(toast: Toast) {
    this.startDismissTimer(toast);
  }
}
