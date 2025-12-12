import { AfterViewInit, Component, inject, input } from '@angular/core';
import { TextDirective } from '../../../directives/ui/text.directive';
import { RateComponent } from "../rate/rate.component";
import { DatePipe } from '@angular/common';
import { StripHtmlPipe } from 'app/pipes/strip-html.pipe';
import { RouterLink } from "@angular/router";
import { ReviewCategory } from 'app/models/review.interface';

@Component({
  selector: 'article[app-card-review]',
  host: {
    class: 'flex flex-col justify-between bg-card text-card-fg rounded p-6'
  },
  imports: [TextDirective, RateComponent, DatePipe, StripHtmlPipe, RouterLink],
  templateUrl: './card-review.component.html',
})
export class CardReviewComponent {
  layout = input<'minimal' | 'default'>('default');
  tags = input<ReviewCategory[]>([]);
  title = input<string>('');
  content = input<string>('');
  rating = input<number>(0);
  created_at = input<Date>();
  book_author = input<string>('');
  author_name = input<string>('');
  author_avatar = input<string>('');
  url = input<string[]>();
  type = input<'post' | 'review'>('review');
}
