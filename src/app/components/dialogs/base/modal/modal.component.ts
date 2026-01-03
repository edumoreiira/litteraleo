import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentRef, DestroyRef, effect, ElementRef, EnvironmentInjector, HostListener, inject, input, output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createAnimation, createQueryAnimations } from '../../../../angular-animations/animations.utils';
import { DocumentListenerService } from '../../../../services/platform/document-listener.service';
import { ModalSizeUnit } from '../../../../models/modal.interface';

@Component({
  selector: 'modal',
  standalone: true,
  imports: [CommonModule],
  host: { '[@queryAnimationsModal]': '', class: 'modal' },
  template: `
  <div class="modal__content" @popUp focusTrap
    style="view-transition-name: modal-content;
    max-width: calc(100% - 1.5rem);"
    [ngStyle]="{
      'min-width': 'min(' + minWidth() + ', calc(100% - 1.5rem))',
      'max-width': maxWidth() ? 'min(' + maxWidth() + ', calc(100% - 1.5rem))' : 'none'
      }"
    [attr.role]="role()" [attr.aria-labelledby]="ariaLabelledBy()" [attr.aria-describedby]="ariaDescribedBy()"
    [attr.aria-label]="ariaLabel()" aria-modal="true"> 
    <button #ModalCloseButton class="close-sr-only" aria-label="Close Modal" (keydown)="onKeydownClose($event)"></button>
        <ng-template #vc></ng-template>
    </div>
    <div class="modal__backdrop" @fadeInOut (click)="onCloseModal.emit()"></div>
  `,
  styleUrl: './modal.component.scss',
  animations: [
    createAnimation('popUp', { duration: '200ms', transform: 'scale(1.1)', opacity: '0' }),
    createAnimation('fadeInOut', { duration: '400ms', opacity: '0' }),
    createQueryAnimations('queryAnimationsModal', '@popUp, @fadeInOut')
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent<T extends Object> implements AfterViewInit {
  // injections
  private envInjector = inject(EnvironmentInjector);
  private documentListener = inject(DocumentListenerService);
  private destroyRef = inject(DestroyRef);

  //content inputs
  public component = input.required<Type<T>>();
  public componentInputs = input<Partial<T>>({});
  
  // content outputs map
  public componentOutputs = input<Record<string, (event: any) => void>>({});

  // modal controls
  onCloseModal = output();
  minWidth = input<ModalSizeUnit>('350px');
  maxWidth = input<ModalSizeUnit | undefined>(undefined);
  role = input.required<string>();
  ariaLabelledBy = input<string>();
  ariaDescribedBy = input<string>();
  ariaLabel = input<string>();

  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;
  @ViewChild('ModalCloseButton') modalCloseButton!: ElementRef;

  public cmpRef?: ComponentRef<T>;

  constructor(){
    effect(() => {
      const event = this.documentListener.event$();
      if(event instanceof KeyboardEvent) {
        this.handleKeyDown(event);
      }
    })
  }


  ngAfterViewInit(): void {
    // focus on the close button so the user get the focus on the modal and trapped inside it
    this.modalCloseButton.nativeElement.focus();
    
    // create component()
    this.cmpRef = this.vc.createComponent(this.component(), { environmentInjector: this.envInjector });

    // set inputs
    for (const [key, value] of Object.entries(this.componentInputs())) {
      this.cmpRef.setInput(key, value);
    }
    
    // bind outputs
    this.bindOutputs();
  }
  
  private bindOutputs(): void {
      if (!this.cmpRef) return;
      const outputs = this.componentOutputs();
      
      for (const [key, callback] of Object.entries(outputs)) {
          // check if the component instance has the property
          if (key in this.cmpRef.instance) {
              const emitter = (this.cmpRef.instance as any)[key];
              
              // check if it is an observable-like object (EventEmitter or OutputEmitterRef)
              if (emitter && typeof emitter.subscribe === 'function') {
                  const sub = emitter.subscribe(callback);
                  // automatically unsubscribe when the modal wrapper is destroyed
                  this.destroyRef.onDestroy(() => sub.unsubscribe());
              }
          }
      }
  }

  onKeydownClose(event: KeyboardEvent) {
     if(event.key === 'Enter' || event.key === ' ') {
       this.onCloseModal.emit();
     }
   } 

  handleKeyDown(event: KeyboardEvent) {
    if(event.key === 'Escape') {
      this.onCloseModal.emit();
    }
  }
    
  
}