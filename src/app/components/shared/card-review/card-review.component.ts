import { AfterViewInit, Component, inject, input } from '@angular/core';
import { TextDirective } from '../../../directives/ui/text.directive';
import { RateComponent } from "../rate/rate.component";
import { DatePipe } from '@angular/common';
import { PostCategory } from 'app/models/post.interface';
import { StripHtmlPipe } from 'app/pipes/strip-html.pipe';

@Component({
  selector: 'article[app-card-review]',
  host: {
    class: 'flex flex-col justify-between bg-card text-card-fg rounded p-6'
  },
  imports: [TextDirective, RateComponent, DatePipe, StripHtmlPipe],
  templateUrl: './card-review.component.html',
})
export class CardReviewComponent {
  layout = input<'minimal' | 'default'>('default');
  tags = input<PostCategory[]>([]);
  title = input<string>('');
  content = input<string>('');
  rating = input<number>(0);
  created_at = input<Date>();
  book_author = input<string>('');
  author_name = input<string>('');
  author_avatar = input<string>('');
}
