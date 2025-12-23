import { AfterContentInit, ChangeDetectionStrategy, Component, computed, contentChildren, effect, ElementRef, inject, input, numberAttribute, OnInit, Renderer2, untracked, viewChild } from '@angular/core';

@Component({
  selector: 'app-infinite-scrolling',
  host: {
    class: 'slider',
    '[class.fade-corner]': 'fadeCorner()',
    '[class.pause-on-hover]': 'pauseOnHover()',
    '[class.vertical]': 'direction() === "vertical"',
    '[class.horizontal]': 'direction() === "horizontal"',
    '[style]': 'sliderStyles()',
    '(window:resize)': 'updateSliderParams()'
  },
  imports: [],
  template: `
    <div class="list"
    [style.padding]="padding()">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './infinite-scrolling.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollingComponent implements AfterContentInit{
  private readonly renderer = inject(Renderer2);
  private readonly slider = inject(ElementRef);
  // 
  readonly speed = input(20, { transform: numberAttribute });
  readonly gap = input(0, { transform: numberAttribute });
  readonly fadeCorner = input<boolean>(true);
  readonly reverse = input<boolean>(false);
  readonly pauseOnHover = input<boolean>(true);
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');
  readonly autoSetWidthHeight = input<boolean>(false);
  readonly padding = input<string | null>(null);
  // 
  sliderStyles = computed(() => {
    return this.getSliderParams();
  }) 
  private readonly items = contentChildren('item', { read: ElementRef });

  constructor() {
    // update styles when items are changed
    effect(() => {
      const items = this.items(); 
      untracked(() => {
        this.updateSliderParams();
        this.setItemParams();
      })
    })
  }


  ngAfterContentInit(): void {
    setTimeout(() => { // await a tick to ensure items are rendered
      this.updateSliderParams();
      this.setItemParams();
    });
  }

  private getItemParams(): [width: number, height: number, quantity: number] {
    const item = this.items().length > 0 ? this.items()[0].nativeElement : null;
    return [
      item ? item.offsetWidth : 0,
      item ? item.offsetHeight : 0,
      this.items().length
    ];
  }

  private getSliderParams() {
    const [width, height, quantity] = this.getItemParams();
    const size = 
    `width: ${this.direction() === 'horizontal' ? '100%' : `${width}px`};
     height: ${this.direction() === 'vertical' ? '100%' : `${height}px`};`

    return `
    --item-width: ${width}px;
    --item-height: ${height}px;
    --quantity: ${quantity};
    --gap: ${this.gap()}px;
    --animation-duration: ${this.speed()}s;
    --animation-direction: ${this.reverse() ? 'reverse' : 'normal'};
    ${this.autoSetWidthHeight() ? size : ''}
    `
  }

  protected updateSliderParams() {
    const sliderEl = this.slider.nativeElement;
    const styles = this.getSliderParams();
    this.renderer.setAttribute(sliderEl, 'style', styles);
  }

  private setItemParams() {
    this.items().forEach((item, index) => {
      const itemEl = item.nativeElement as HTMLElement;
      itemEl.style.setProperty('--position', (index + 1).toString());
      itemEl.classList.add('item');
    });
  }
  
}
