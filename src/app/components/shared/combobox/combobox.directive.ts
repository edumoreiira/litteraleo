// combobox.directive.ts
import {
  Directive,
  OnInit,
  OnDestroy,
  HostListener,
  ViewContainerRef,
  inject,
  input,
  signal,
  output,
  effect,
  untracked,
  ComponentRef,
} from '@angular/core';
import {
  Overlay,
  OverlayRef
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ComboboxComponent, ComboboxOption, CustomWidth } from './combobox.component';
import { COMBOBOX_OVERLAY_POSITIONS } from './overlay-positions';

@Directive({
  selector: '[appCombobox]',
  exportAs: 'comboboxDirective',
  providers: [Overlay, CdkOverlayOrigin],
})
export class ComboboxDirective implements OnInit, OnDestroy {
  private origin = inject(CdkOverlayOrigin);
  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  comboboxRef?: ComponentRef<ComboboxComponent>
  // 
  readonly _label = input<string>('Selecione uma opção', { alias: 'label' });
  readonly initialOptions = input.required<ComboboxOption[]>({ alias: 'options' });
  readonly allowMultipleOptions = input(false);
  readonly dumbComponent = input(false);
  readonly customWidth = input<CustomWidth>();

  options = signal<ComboboxOption[]>([]);
  activeOptions = output<ComboboxOption[]>();
  updatedLabel = output<string>();

  private overlayRef!: OverlayRef;

  updateComboboxOnInputChange = effect(() => {
    this.options.set(this.initialOptions());
    untracked(() => {
      this.updateLabel(this.initialOptions()) // update label on input change
      this.comboboxRef?.setInput('options', this.options()); // update combobox options if input changes
    })
  });

  ngOnInit() {
    this.createOverlay(); 
    this.setInitialLabelValue();
  }

  ngOnDestroy() {
    this.overlayRef.dispose();
  }

  private open() {
    const portal = new ComponentPortal(ComboboxComponent, this.vcr);
    this.comboboxRef = this.overlayRef.attach(portal);
    
    this.setupComboboxInputs(); // set inputs for the combobox component
    this.handleComboboxEvents(); // listen to combobox emits
    this.forceUpdateComboboxPosition(); // force update position to ensure correct placement (avoid issues caused by :enter animations)
  }

  private setupComboboxInputs() {
    if (!this.comboboxRef) return;
    const isFirstOpen = this.options().length === 0;
    isFirstOpen ? this.comboboxRef.setInput('options', this.initialOptions()) : this.comboboxRef.setInput('options', this.options()); // set initialOptions input if first open, otherwise use the signal value
    this.comboboxRef.setInput('allowMultipleOptions', this.allowMultipleOptions());
    this.comboboxRef.setInput('dumbComponent', this.dumbComponent());
    this.comboboxRef.setInput('customWidth', this.customWidth());
  }

  private handleComboboxEvents() {
    if (!this.comboboxRef) return;
    this.comboboxRef.instance.activeOptions.subscribe((activeOptions) => {
      this.activeOptions.emit(activeOptions)
      if (this.dumbComponent() === false) this.updateLabel(activeOptions); // update label on options change (when combobox is open and user selects options)
    }); // emit active options changes
    this.comboboxRef.instance.lastComboboxOptions.subscribe((lastOptions) => { // update options when combobox is closed with last changes
      if (this.dumbComponent() === false) this.options.set(lastOptions);
    });
    this.comboboxRef.instance.clickOutside.subscribe(() => this.close());
  }

  private close() {
    this.overlayRef.detach();
  }

  private setInitialLabelValue() {
    this.updatedLabel.emit(this._label());
  }

  private updateLabel(options: ComboboxOption[]) {
    const activeOptions = options.filter(item => item.active);
    if (activeOptions.length > 0) {
      this.updatedLabel.emit(activeOptions.map(item => item.label).join(', '));
    } else {
      this.setInitialLabelValue(); // reset to initial label if no active options
    }
  }

  private forceUpdateComboboxPosition() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 400);
  }

  private createOverlay() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.origin.elementRef)
      .withPositions(COMBOBOX_OVERLAY_POSITIONS);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }

  @HostListener('click')
  toggle() {
    this.overlayRef.hasAttached() ? this.close() : this.open();
  }

}
