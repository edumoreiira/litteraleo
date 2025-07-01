import { ChangeDetectionStrategy, Component, computed, effect, forwardRef, inject, input, model, OnInit, signal } from "@angular/core";
import { DocumentListenerService } from "../../../services/platform/document-listener.service";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
 selector: 'app-searchbar',
 templateUrl: './searchbar.component.html',
 imports: [FormsModule],
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchbarComponent {
  documentListener = inject(DocumentListenerService);
  // 
  readonly _mobileViewport = input(0, {alias: 'mobileView'}); // viewport width in pixels that triggers the mobile version of searchbar
  readonly isMobile = computed(() => this.documentListener.screenSize$() <= this._mobileViewport());
  readonly placeholder = input<string>('Pesquisar...');
  value = model<string>('');
}