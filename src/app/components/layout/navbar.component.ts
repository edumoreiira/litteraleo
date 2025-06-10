import { AfterViewChecked, ChangeDetectionStrategy, Component, computed, ElementRef, HostBinding, HostListener, inject, signal } from '@angular/core';
import { ButtonComponent } from '../base/Button/button.component';
import { SearchbarComponent } from "../shared/searchbar/searchbar.component";
import { DocumentListenerService } from '../../services/platform/document-listener.service';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../services/ui/modal.service';
import { SignInFormComponent } from '../forms/sign-in-form/sign-in-form.component';
<<<<<<< HEAD
import { AuthWrapperComponent } from '../forms/auth-wrapper/auth-wrapper.component';
=======
>>>>>>> 5eeeb41174503a00b08407cf912cfd83a744f7b3

@Component({
  selector: 'app-navbar',
  host: {
    class: 'sticky block top-[0] left-[0] w-full z-50 px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between transition-colors',
    '[attr.style]': '"transform: translateY(-" + navbarOffset() + "px);"',
    '[class.bg-extreme]': 'sm() ? scrollFromTop() > 60 : scrollFromTop() > 30',
  },
  templateUrl: './navbar.component.html',
  imports: [ButtonComponent, SearchbarComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements AfterViewChecked {
  protected documentListener = inject(DocumentListenerService);
  private el = inject(ElementRef);
  private modal = inject(ModalService);
  //
  navbarOffset = signal(0);
  lastScrollTop = 0;
  maxOffset = 90;
  scrollFromTop = computed(() => this.documentListener.scrollFromTop$());
  sm = computed(() => this.documentListener.isSm());

  ngAfterViewChecked(): void {
    this.maxOffset = this.el.nativeElement.offsetHeight; // update maxOffset based on the navbar height
    if(typeof window !== 'undefined') {
      this.handleNavbarOffset(); // ensure the offset is correctly set after view checked
    }
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

  openLoginModal() {
    const modalRef = this.modal.open(AuthWrapperComponent, 
      { role: 'dialog', componentInputs: {
        initialMode: 'sign-in'
      } })
  }
  openSignUpModal() {
    const modalRef = this.modal.open(AuthWrapperComponent, 
      { role: 'dialog', componentInputs: {
        initialMode: 'sign-up'
      } })
  }
  //host listeners
  @HostListener('window:scroll')
  onWindowScroll() {
    this.handleNavbarOffset();
  }
}
