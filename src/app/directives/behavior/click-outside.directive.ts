import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',

  host: {
    '(document:click)': 'onClickOutside($event)',
  },
})
export class ClickOutsideDirective {
  clickOutside = output<void>();
  private readonly elementRef = inject(ElementRef);
  private isFirstClick = true; // Example 3
  protected onClickOutside(e: Event) {
    if (this.isFirstClick) {
      this.isFirstClick = false;
      return;
    }

    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.clickOutside.emit();
    }
  }
}
