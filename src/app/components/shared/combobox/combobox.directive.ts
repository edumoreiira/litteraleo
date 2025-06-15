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
  OverlayRef,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ComboboxComponent, ComboboxOption } from './combobox.component';

const overlayPositions: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 5
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 5
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -5
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -5
  },
];

@Directive({
  selector: '[appCombobox]',
  exportAs: 'comboboxDirective',
  providers: [Overlay, CdkOverlayOrigin],
})
export class ComboboxDirective implements OnInit, OnDestroy {
  comboboxRef?: ComponentRef<ComboboxComponent>
  // 
  readonly _label = input<string>('Selecione uma opção', { alias: 'label' });
  readonly initialOptions = input.required<ComboboxOption[]>({ alias: 'options' });
  readonly allowMultipleOptions = input(false);
  options = signal<ComboboxOption[]>([]);

  updateComboboxOnInputChange = effect(() => {
    this.options.set(this.initialOptions());
    console.log('xd')
    untracked(() => {
      this.updateLabel(this.initialOptions())
      this.comboboxRef?.setInput('options', this.options());
    }) // update label on input change
  });

  activeOptions = output<ComboboxOption[]>();
  updatedLabel = output<string>();

  private overlayRef!: OverlayRef;
  private origin = inject(CdkOverlayOrigin);
  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);

  ngOnInit() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.origin.elementRef)
      .withPositions(overlayPositions)

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.overlayRef.backdropClick().subscribe(() => this.close());
    
    this.setInitialLabelValue();
    console.log(this._label())
  }

  ngOnDestroy() {
    this.overlayRef.dispose();
  }

  private open() {
    const portal = new ComponentPortal(ComboboxComponent, this.vcr);
    const isFirstOpen = this.options().length === 0;
    this.comboboxRef = this.overlayRef.attach(portal);

    isFirstOpen ? this.comboboxRef.setInput('options', this.initialOptions()) : this.comboboxRef.setInput('options', this.options()); // set initialOptions input if first open, otherwise use the signal value
    this.comboboxRef.setInput('allowMultipleOptions', this.allowMultipleOptions());

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 400); // Adjust overlay position after opening

    this.comboboxRef.instance.activeOptions.subscribe((activeOptions) => {
      this.activeOptions.emit(activeOptions)
      this.updateLabel(activeOptions); // update label on options change (when combobox is open and user selects options)
    }); // emit active options changes
    this.comboboxRef.instance.lastComboboxOptions.subscribe((lastOptions) => { // update options when combobox is closed with last changes
      this.options.set(lastOptions);
    });
  }

  private close() {
    this.overlayRef.detach();
  }

  setInitialLabelValue() {
    this.updatedLabel.emit(this._label());
  }

  updateLabel(options: ComboboxOption[]) {
    const activeOptions = options.filter(item => item.active);
    if (activeOptions.length > 0) {
      this.updatedLabel.emit(activeOptions.map(item => item.label).join(', '));
    } else {
      this.setInitialLabelValue(); // reset to initial label if no active options
    }
  }

  @HostListener('click')
  toggle() {
    this.overlayRef.hasAttached() ? this.close() : this.open();
  }

}
