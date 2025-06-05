import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { createAnimation } from '../../../angular-animations/animations.utils';

@Component({
  selector: 'app-rate',
  imports: [NgClass],
  host: {
    class: 'flex items-center'
  },
  template: `
    @for(star of stars(); track $index) {
      <div class="relative">
        <i class="fi fi-br-star opacity-50 transition-all"
        [ngClass]="{'cursor-pointer': canVote()}"
        (mouseenter)="canVote() ?  onMouseIn($index) : null"
        (mouseout)="canVote() ?  onMouseOut() : null"
        (click)="canVote() ? rate($index + 1) : null"></i>
        @if(star === 1) {
          <i class="fi fi-sr-star transition-all absolute left-[0] top-[0] pointer-events-none" @popIn></i>
        }
      </div>
    }
  `,
  animations: [createAnimation('popIn', { transform: 'scale(0) '})],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateComponent implements OnInit{
  canVote = input(true);
  maxStars = input(5);
  initialRating = input(3);
  rating = signal(0);
  stars = signal<number[]>([]);
  onRate = output<number>()

  ngOnInit(): void {
    this.setRating(this.initialRating());
  }

  rate(value: number) {
    this.setRating(value);
    this.onRate.emit(value);
  }

  setRating(rating: number) {
    this.rating.set(rating);
    this.setStars(rating);
  }

  setStars(filledStars: number) {
    const length = this.maxStars();
    const newStarsArray = Array.from( { length }, (undefined,i) => (i < filledStars ? 1 : 0));
    this.stars.set(newStarsArray);
  }

  onMouseIn(starIndex: number) {
    this.setStars(starIndex + 1);
  }

  onMouseOut() {
    this.setStars(this.rating());
  }
}
