import { AfterContentInit, AfterViewInit, computed, Directive, effect, ElementRef, inject, input, NgZone, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { EmButtonToggleGroupComponent } from "./em-button-toggle-group.component";
import { isPlatformBrowser } from "@angular/common";

interface ButtonState {
  height: number;
  width: number;
  offsetX: number;
  offsetY: number;
}

@Directive({
  selector: 'em-button-toggle-group[em-button-toggle-animation]',
  host: {
    '[class]': 'buttonClass()',
    '(window:resize)': 'updateButtonBackgroundPosition()',
  }
})
export class EmButtonToggleAnimationDirective implements OnInit, OnDestroy {
  private readonly group = inject(EmButtonToggleGroupComponent);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  private resizeObserver?: ResizeObserver;
  private state: ButtonState[] = [];

  private readonly activeButtonIndex = computed(() => {
    return this.group.buttons().findIndex((b) => b.checked());
  });

  variant = input<'contained' | 'outlined'>('outlined');

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      const activeIndex = this.activeButtonIndex();
      // only run if activeIndex is set and on browser
      this.updateButtonBackgroundPosition();
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateButtonBackgroundPosition();
      });
      this.resizeObserver.observe(this.el.nativeElement);
    }

  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private updateState(): void {
    this.state = this.group.buttons().map((button, index) => {
      const buttonElement = button.el.nativeElement;
      return {
        index,
        height: buttonElement.offsetHeight,
        width: buttonElement.offsetWidth,
        offsetX: buttonElement.offsetLeft,
        offsetY: buttonElement.offsetTop,
      };
    });
  }

  private setClassVariables(): void {
    const activeIndex = this.activeButtonIndex();
    if( activeIndex < 0 ) { // when no button is selected
      this.el.nativeElement.style.setProperty('--top', `-150%`); // hide the background
      return;
    }
    if (!this.state[activeIndex]) return;

    const activeState = this.state[activeIndex];
    this.el.nativeElement.style.setProperty('--left', `${activeState.offsetX}px`);
    this.el.nativeElement.style.setProperty('--top', `${activeState.offsetY}px`);
    this.el.nativeElement.style.setProperty('--width', `${activeState.width}px`);
    this.el.nativeElement.style.setProperty('--height', `${activeState.height}px`);
  }

  protected updateButtonBackgroundPosition(): void {
    this.updateState();
    this.setClassVariables();
  }

  buttonClass() {
    const base = 'em-button-toggle-group-animation';
    return `${base} btn-${this.variant()}`;
  }
  
}
