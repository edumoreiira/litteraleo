import { Component, inject, input } from '@angular/core';
import { TextDirective } from '../../../directives/ui/text.directive';
import { RateComponent } from "../rate/rate.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'article[app-card-review]',
  host: {
    class: 'bg-card text-card-fg rounded p-6'
  },
  imports: [TextDirective, RateComponent, DatePipe],
  templateUrl: './card-review.component.html',
})
export class CardReviewComponent {
  layout = input<'minimal' | 'default'>('default');
  tags = input<string[]>([]);
  title = input<string>('');
  content = input<string>('');
  rating = input<number>(0);
  date = input<Date>(new Date());
  book_author = input<string>('');
  author_name = input<string>('');
  author_avatar = input<string>('');
}
