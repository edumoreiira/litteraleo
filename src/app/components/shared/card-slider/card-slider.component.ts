import { Component, contentChild, contentChildren, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { createAnimation } from '../../../angular-animations/animations.utils';

@Component({
  selector: 'app-card-slider',

  imports: [],
  host: {
    class: 'relative max-w-full'
  },
  template: `
    <div #cardContainer class="flex items-start gap-4 overflow-auto hide-scrollbar snap-x snap-mandatory relative'">
      <ng-content></ng-content>
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
export class CardSlider implements OnInit {
  // To use this component, you need to use #card on child component you want to measure the width of scroll.
  // Example:
  // <app-card-slider>
  //   <app-review-card #card></app-review-card>  =>  this will be the card that will be used to measure the width of scroll.
  //   <app-review-card></app-review-card>
  // </app-card-slider>

  private cardContainerRef = viewChild('cardContainer', { read: ElementRef });
  private cardRef = contentChild('card', { read: ElementRef });
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
