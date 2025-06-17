import { Component } from '@angular/core';
import { TextDirective } from '../../../directives/ui/text.directive';

@Component({
  selector: 'article[app-card-review]',
  host: {
    class: 'bg-card text-card-fg rounded p-6'
  },
  imports: [TextDirective],
  templateUrl: './card-review.component.html',
})
export class CardReviewComponent {

}
