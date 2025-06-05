import { Component } from '@angular/core';
import { TextDirective } from '../../../directives/ui/text.directive';

@Component({
  selector: 'article[app-review-card]',
  host: {
    class: 'bg-card text-card-fg rounded p-6'
  },
  imports: [TextDirective],
  templateUrl: './review-card.component.html',
})
export class ReviewCardComponent {

}
