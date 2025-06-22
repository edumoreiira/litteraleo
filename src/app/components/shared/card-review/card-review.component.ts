import { Component, inject, input } from '@angular/core';
import { TextDirective } from '../../../directives/ui/text.directive';
import { RateComponent } from "../rate/rate.component";

@Component({
  selector: 'article[app-card-review]',
  host: {
    class: 'bg-card text-card-fg rounded p-6'
  },
  imports: [TextDirective, RateComponent],
  templateUrl: './card-review.component.html',
})
export class CardReviewComponent {
  layout = input<'minimal' | 'default'>('default');
}
