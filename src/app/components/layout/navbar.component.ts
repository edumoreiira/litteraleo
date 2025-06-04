import { AfterViewChecked, ChangeDetectionStrategy, Component, computed, ElementRef, HostBinding, HostListener, inject, signal } from '@angular/core';
import { ButtonComponent } from '../base/Button/button.component';
import { SearchbarComponent } from "../shared/searchbar/searchbar.component";
import { DocumentListenerService } from '../../services/platform/document-listener.service';

@Component({
  selector: 'app-navbar',
  host: {
    class: 'sticky block top-[0] left-[0] w-full z-50 px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between transition-colors',
    '[attr.style]': '"transform: translateY(-" + navbarOffset() + "px);"',
    '[class.bg-extreme]': 'sm() ? scrollFromTop() > 60 : scrollFromTop() > 30',
  },
  templateUrl: './navbar.component.html',
  imports: [ButtonComponent, SearchbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements AfterViewChecked {
  protected documentListener = inject(DocumentListenerService);
  //
  el = inject(ElementRef);
  navbarOffset = signal(0);
  lastScrollTop = 0;
  maxOffset = 90;
  scrollFromTop = computed(() => this.documentListener.scrollFromTop$());
  sm = computed(() => this.documentListener.isSm());

  ngAfterViewChecked(): void {
    this.maxOffset = this.el.nativeElement.offsetHeight; // update maxOffset based on the navbar height
    this.handleNavbarOffset(); // ensure the offset is correctly set after view checked
  }

  handleNavbarOffset() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    const delta = scrollTop - this.lastScrollTop;
    const isAboveThreshold = this.sm() ? scrollTop > 150 : scrollTop > 60;

    if(isAboveThreshold) {
      this.navbarOffset.update(offset => 
        Math.min(Math.max(offset + delta, 0), this.maxOffset)
      );
    } else {
      this.navbarOffset.set(0); //reset navbar offset if scrolled above threshold
    }
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }
  //host listeners
  @HostListener('window:scroll')
  onWindowScroll() {
    this.handleNavbarOffset();
  }
}
