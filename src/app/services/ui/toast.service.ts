import { ApplicationRef, ComponentRef, createComponent, effect, EnvironmentInjector, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ToastComponent } from 'app/components/shared/toast/toast.component';
import { Toast } from 'app/models/toast.interface';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private enviromentInjector = inject(EnvironmentInjector);
  private applicationRef = inject(ApplicationRef);
  private document = inject(DOCUMENT);
  private componentRef: ComponentRef<ToastComponent> | null = null;
  private toasts = signal<Toast[]>([]);
  private toastId = 0;
  public $toasts = this.toasts.asReadonly();

  constructor() {
    effect(() => {
      if (this.toasts().length > 0) {
        this.createToastComponent();
      } else {
        this.destroyToastComponent();
      }
    });
  }

  public create(toast: Toast) {
    const newToast = toast;
    newToast.id = this.toastId++; // assigns a unique id to each toast
    newToast.isVisible = true;
    this.toasts.update(list => [...list, newToast]);
  }

  public removeToast(toast: Toast) {
    const newToastArray = this.toasts().filter(value => value.id !== toast.id); // create a new toastArray excluding selected toasted parameter
    this.toasts.set(newToastArray);
  }

  private createToastComponent() {
    if (!this.componentRef) {
      this.componentRef = createComponent(ToastComponent, { environmentInjector: this.enviromentInjector }); // create standalone component
      this.applicationRef.attachView(this.componentRef.hostView);
      this.document.body.appendChild(this.componentRef.location.nativeElement);
    }
  }

  private destroyToastComponent() {
    if(this.componentRef) {
      this.applicationRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

}
