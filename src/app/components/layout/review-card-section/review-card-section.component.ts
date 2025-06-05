import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ReviewCardComponent } from '../../shared/review-card/review-card.component';
import { createAnimation } from '../../../angular-animations/animations.utils';

@Component({
  selector: 'app-review-card-section',

  imports: [ReviewCardComponent],
  host: {
    class: 'relative max-w-full'
  },
  template: `
    <div #cardContainer class="flex items-start gap-4 overflow-auto hide-scrollbar snap-x snap-mandatory relative'">
      <article #card app-review-card class="flex-1 snap-start min-w-[389px]"></article>
      <article app-review-card class="flex-1 snap-start min-w-[389px]"></article>
      <article app-review-card class="flex-1 snap-center min-w-[389px]"></article>
      <article app-review-card class="flex-1 snap-end min-w-[389px]"></article>
      <article app-review-card class="flex-1 snap-end min-w-[389px]"></article>
    </div>
    @if(scrollPosition() !== 'end') {
      <button @fadeIn
      class="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10 bg-extreme p-3 rounded-full shadow-xs text-fg
      hover:text-primary hover:scale-110 transition-all cursor-pointer" aria-label="Rodar cards para à direita"
      (click)="scrollRight()">
        <i class="fi fi-br-angle-small-right text-xl"></i>
      </button>
    }
    @if(scrollPosition() !== 'start') {
      <button @fadeIn
      class="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-10 bg-extreme p-3 rounded-full shadow-xs text-fg
      hover:text-primary hover:scale-110 transition-all cursor-pointer" aria-label="Rodar cards para à esquerda"
      (click)="scrollLeft()">
        <i class="fi fi-br-angle-small-left text-xl"></i>
      </button>
    }
    `,
    animations: [createAnimation('fadeIn', { transform: 'scale(.5)'})]
})
export class ReviewCardSectionComponent implements OnInit {
  private cardContainerRef = viewChild('cardContainer', { read: ElementRef });
  private cardRef = viewChild('card', { read: ElementRef });
  // 
  protected scrollPosition = signal<'start' | 'end' | 'middle'>('middle');

 ngOnInit(): void {
  this.getScrollPosition();
   this.cardContainerRef()?.nativeElement.addEventListener('scroll', () => {
      this.getScrollPosition()
    });
 }

  scrollRight() {
    const cardElement = this.cardRef()?.nativeElement;
    if (cardElement) {
      const scrollAmount = cardElement.offsetWidth;
      this.scroll(scrollAmount);
    }
  }
  scrollLeft() {
    const cardElement = this.cardRef()?.nativeElement;
    if (cardElement) {
      const scrollAmount = -cardElement.offsetWidth;
      this.scroll(scrollAmount);
    }
  }
  
  scroll(size: number) {
    const cardContainer = this.cardContainerRef()?.nativeElement as HTMLElement;
    cardContainer.scrollBy({
      left: size,
      behavior: 'smooth'
    })
  }

  getScrollPosition() {
    const cardContainer = this.cardContainerRef()?.nativeElement as HTMLElement;
    const isAtStart = cardContainer.scrollLeft === 0;
    const isAtEnd = cardContainer.scrollLeft + cardContainer.clientWidth >= cardContainer.scrollWidth 
    if (isAtStart) {
      this.scrollPosition.set('start');
    } else if (isAtEnd) {
      this.scrollPosition.set('end');
    } else {
      this.scrollPosition.set('middle');
    }
  }


}
