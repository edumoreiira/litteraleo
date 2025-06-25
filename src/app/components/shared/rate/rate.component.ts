import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, model, OnInit, output, signal } from '@angular/core';
import { createAnimation } from '../../../angular-animations/animations.utils';

@Component({
  selector: 'app-rate',
  imports: [NgClass],
  host: {
    class: 'flex items-center',
    '(mouseleave)': 'canVote() ?  onMouseOut() : null'
  },
  template: `
    @for(star of stars(); track $index) {
      <div class="relative">
        <i class="fi fi-br-star opacity-50 transition-all"
        [ngClass]="{'cursor-pointer': canVote()}"
        (mouseenter)="canVote() ?  onMouseIn($index) : null"
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
export class RateComponent {
  public canVote = input(true);
  public maxStars = input(5);
  // 
  public rating = model<number>(3);
  protected stars = linkedSignal({
    source: this.rating,
    computation:() => {
      return this.buildStarsArray(this.rating());
    }
  });

  rate(value: number) {
    this.rating.set(value);
  }

  setStars(filledStars: number) {
    const starsArray = this.buildStarsArray(filledStars);
    this.stars.set(starsArray);
  }

  private buildStarsArray(filledStars: number): number[] {
    const length = this.maxStars();
    const flooredFilledStars = Math.floor(filledStars);
    return Array.from({ length }, (undefined, i) => (i < flooredFilledStars ? 1 : 0));
  }

  onMouseIn(starIndex: number) {
    this.setStars(starIndex + 1);
  }

  onMouseOut() {
    this.setStars(this.rating());
  }
}
