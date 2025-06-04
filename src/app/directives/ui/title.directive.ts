import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appTitle]',
  host: {
    '[class]': 'getClass()' 
  },
})
export class TitleDirective {
  size = input<'sm' | 'base' | 'lg'>("base")
  base = 'font-serif font-bold text-primary'
  getClass() {
    switch (this.size()) {
      case 'lg':
        return `${this.base} text-5xl lg:text-6xl`;
      case 'base':
        return `${this.base} text-4xl lg:text-5xl`;
      case 'sm':
        return `${this.base} text-3xl lg:text-4xl`;
    }
  }

}
