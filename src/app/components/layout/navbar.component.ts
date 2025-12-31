import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { ButtonComponent } from '../base/Button/button.component';
import { DocumentListenerService } from '../../services/platform/document-listener.service';
import { RouterLink } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { UserIconComponent } from "./user-icon/user-icon.component";
import { HasRoleDirective } from 'app/directives/auth/has-role.directive';
import { AuthModalService } from 'app/services/ui/auth-modal.service';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { UserProfileService } from 'app/services/api/user-profile/user-profile.service';
import { ClickOutsideDirective } from "app/directives/utils/click-outside.directive";

@Component({
  selector: 'app-navbar',
  host: {
    class: 'sticky block top-[0] left-[0] w-full z-50 py-4 transition-colors border-b relative',
    '[attr.style]': '"transform: translateY(-" + navbarOffset() + "px);"',
    '[class.bg-extreme]': 'sm() ? scrollFromTop() > 60 : scrollFromTop() > 30',
    '[class.border-b-border/40]': 'scrollFromTop() > 20',
    '[class.border-b-transparent]': 'scrollFromTop() <= 20',
  },
  templateUrl: './navbar.component.html',
  imports: [ButtonComponent, RouterLink, UserIconComponent, HasRoleDirective, ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [createAnimation('popNavbar', { transform: 'scale(.95)', duration: '100ms' })]
})
export class NavbarComponent implements AfterViewInit {
  protected documentListener = inject(DocumentListenerService);
  private el = inject(ElementRef);
  private auth = inject(AuthService);
  private authModal = inject(AuthModalService);
  private userProfileService = inject(UserProfileService);
  // 
  protected isUserLoggedIn = computed(() => !!this.auth.$currentUser());
  //
  protected navBarOpen = signal(false);
  protected userProfile = computed(() => this.userProfileService.userProfile$());
  protected navbarOffset = signal(0);
  protected lastScrollTop = 0;
  protected maxOffset = 90;
  protected scrollFromTop = computed(() => this.documentListener.scrollFromTop$());
  protected sm = computed(() => this.documentListener.isSm());

  ngAfterViewInit(): void {
    this.maxOffset = this.el.nativeElement.offsetHeight; // update maxOffset based on the navbar height
    if(typeof window !== 'undefined') {
      this.handleNavbarOffset(); // ensure the offset is correctly set after view checked
    }
  }

  private handleNavbarOffset() {
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

  protected openLoginModal() {
    this.authModal.openLoginModal();
  }
  protected openSignUpModal() {
    this.authModal.openSignUpModal();
  }

  protected async logout() {
    await this.auth.logout();
  }

  protected toggleNavBar() {
    this.navBarOpen.update(open => !open);
  }
  

  //host listeners
  @HostListener('window:scroll')
  onWindowScroll() {
    this.handleNavbarOffset();
  }
}
