import { Directive } from "@angular/core";

@Directive({
  selector: '[appText]',
  host: {
    class: 'text-lg sm:text-xl font-light text-muted-fg'
  },  
})
export class TextDirective {
  // base = 'text-lg sm:text-xl font-light text-muted-fg'
}