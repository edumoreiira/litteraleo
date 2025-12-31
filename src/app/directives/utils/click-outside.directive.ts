import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  output,
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
  allowFirstClick = input(false, { transform: booleanAttribute });
  private isFirstClick = true; // Example 3
  protected onClickOutside(e: Event) {
    if (this.isFirstClick && !this.allowFirstClick()) {
      this.isFirstClick = false;
      return;
    }

    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.clickOutside.emit();
    }
  }
}
