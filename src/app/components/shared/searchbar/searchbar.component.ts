import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { DocumentListenerService } from "../../../services/platform/document-listener.service";

@Component({
 selector: 'app-searchbar',
 templateUrl: './searchbar.component.html',
 imports: [],
})
export class SearchbarComponent {
  documentListener = inject(DocumentListenerService);
  // 
  _mobileViewport = input(0, {alias: 'mobileView'}); // viewport width in pixels that triggers the mobile version of searchbar
  isMobile = computed(() => this.documentListener.screenSize$() <= this._mobileViewport());

}