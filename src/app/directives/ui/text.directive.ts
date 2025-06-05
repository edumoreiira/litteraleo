import { Directive, input } from "@angular/core";

@Directive({
  selector: '[appText]',
  host: {
    '[class]': 'getClass()'
  },  
})
export class TextDirective {
  base = 'text-muted-fg';
  size = input<'sm' | 'base' | 'lg'>("base");

  getClass() {
    switch (this.size()) {
      case 'lg':
        return `${this.base} text-lg sm:text-xl`;
      case 'base':
        return `${this.base} text-base sm:text-lg`;
      case 'sm':
        return `${this.base} text-sm sm:text-base`;
    }
  }
}