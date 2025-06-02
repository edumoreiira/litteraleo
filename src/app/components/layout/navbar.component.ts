import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { ButtonComponent } from '../base/Button/button.component';

@Component({
  selector: 'app-navbar',
  host: {
    class: 'sticky block top-[0] left-[0] w-full z-50 bg-white px-12 py-4 flex items-center justify-between',
    '[attr.style]': '"transform: translateY(-" + navbarOffset() + "px);"',
  },
  templateUrl: './navbar.component.html',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements AfterViewChecked {
  el = inject(ElementRef);
  navbarOffset = signal(0);
  lastScrollTop = 0;
  maxOffset = 90;

  ngAfterViewChecked(): void {
    this.maxOffset = this.el.nativeElement.offsetHeight;
  }
  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const delta = scrollTop - this.lastScrollTop;

    this.navbarOffset.update(offset => offset + delta);
    this.navbarOffset.update(offset => Math.min(Math.max(offset, 0), this.maxOffset));
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }
}
