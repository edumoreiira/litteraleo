import {
  computed,
  Injectable,
  Renderer2,
  RendererFactory2,
  Signal,
  signal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentListenerService {
  private renderer: Renderer2;
  private eventSignal = signal<MouseEvent | KeyboardEvent | null>(null);
  private screenSize = signal(0);
  private scrollFromTop = signal(0);
  //
  screenSize$ = this.screenSize.asReadonly();
  get event$(): Signal<MouseEvent | KeyboardEvent | null> {
    return this.eventSignal.asReadonly();
  }
  scrollFromTop$ = this.scrollFromTop.asReadonly();
  //viewports
  readonly isXs = computed(() => this.screenSize() < 640);
  readonly isSm = computed(() => this.screenSize() >= 640);
  readonly isMd = computed(() => this.screenSize() >= 768);
  readonly isLg = computed(() => this.screenSize() >= 1024);
  readonly isXl = computed(() => this.screenSize() >= 1280);
  readonly is2xl = computed(() => this.screenSize() >= 1536);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.registerClickEventListener();
    this.registerKeyboardEventListener();
    this.registerScreenResizeListener();
    this.registerScrollEventListener();
    this.updateScreenSize();
  }
  
  private registerClickEventListener() {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.eventSignal.set(event);
    });
  }

  private registerKeyboardEventListener() {
    this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
      this.eventSignal.set(event);
    });
  }

  private registerScreenResizeListener() {
    this.renderer.listen('window', 'resize', () => {
      this.updateScreenSize();
    });
  }

  private registerScrollEventListener() {
    this.renderer.listen('window', 'scroll', () => {
      this.updateScrollPositionFromTop();
    });
  }

  private updateScreenSize() {
    if (typeof window !== 'undefined') {
      this.screenSize.set(window.innerWidth);
    }
  }

  private updateScrollPositionFromTop() {
    if (typeof window !== 'undefined') {
      const distanceFromTop =
        window.scrollY || document.documentElement.scrollTop;
      this.scrollFromTop.set(distanceFromTop);
    }
  }
}
