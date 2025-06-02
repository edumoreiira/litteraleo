import { AfterViewChecked, ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { ButtonComponent } from '../base/Button/button.component';
import { SearchbarComponent } from "../shared/searchbar/searchbar.component";
import { DocumentListenerService } from '../../services/platform/document-listener.service';

@Component({
  selector: 'app-navbar',
  host: {
    class: 'sticky block top-[0] left-[0] w-full z-50 bg-white px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between',
    '[attr.style]': '"transform: translateY(-" + navbarOffset() + "px);"',
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

  ngAfterViewChecked(): void {
    this.maxOffset = this.el.nativeElement.offsetHeight; // update maxOffset based on the navbar height
  }


  //host listeners
  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    const delta = scrollTop - this.lastScrollTop;
    this.navbarOffset.update(offset => offset + delta);
    this.navbarOffset.update(offset => Math.min(Math.max(offset, 0), this.maxOffset));
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }
}
