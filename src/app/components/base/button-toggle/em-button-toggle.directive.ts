import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, computed, Directive, ElementRef, inject, input, model, output, Renderer2, signal } from "@angular/core";
import { EmButtonToggleGroupComponent } from "./em-button-toggle-group.component";

export interface EmButtonToggleChange {
  source: EmButtonToggleDirective,
  value: any
}

@Directive({
  selector: 'button[em-button-toggle]',
  standalone: true,
  host: {
    'type': 'button',
    '[class]': 'class()',
    'role': 'radio',
    'tabindex': '0',
    '[attr.name]': 'name()',
    // now we just read the model signal directly
    '[attr.aria-checked]': 'checked() ? "true" : "false"',
    '[class.selected]': 'checked()',
    '[disabled]': 'finalDisabled()',
    '[attr.aria-disabled]': 'finalDisabled()',
    '(click)': 'handleClick()',
    '(pointerenter)': 'onPointerEnter()',
    '(pointerleave)': 'onPointerLeave()'
  }
})
export class EmButtonToggleDirective {
  public readonly el = inject(ElementRef);
  private readonly group = inject(EmButtonToggleGroupComponent, { optional: true, host: true });
  private readonly renderer = inject(Renderer2);

  readonly name = signal<string | null>(null);
  readonly value = input.required<any>();
  readonly selectionChange = output<EmButtonToggleChange>();
  readonly individualDisabled = input(false, { alias: 'disabled' });
  readonly activeStyles = input<string>('', { alias: 'active' });
  readonly hoveredStyles = input<string>('', { alias: 'hover' });
  readonly checked = computed(() => {
    return this.getCheckedState();
  })

  readonly finalDisabled = computed(() => {
    return this.group?.disabled() || this.individualDisabled();
  });

  protected handleClick() {
    if (this.finalDisabled()) {
      return;
    }
    this.selectionChange.emit({ source: this, value: this.value() });
  }
  
  private getCheckedState() {
    // If there is no group, this button is not checked
    if (!this.group) {
      return false;
    }
    const groupValue = this.group.$value();
    const buttonValue = this.value();
    let isChecked: boolean;
    // If group allows multiple selection, check if buttonValue is in groupValue array
    if (this.group.multiple()) {
      // Ensure groupValue is an array and includes buttonValue
      isChecked = Array.isArray(groupValue) && groupValue.includes(buttonValue);
    } else {
      // Single selection: check if groupValue equals buttonValue
      isChecked = groupValue === buttonValue;
    }

    // removes hovered class before change state;
    if(isChecked) {
      this.removeHoveredClasses();
    }

    return isChecked;
  }

  protected onPointerEnter() {
    if (this.finalDisabled() || this.checked()) return;
    this.addHoveredClasses();
  }

  protected onPointerLeave() {
    if (this.finalDisabled() || this.checked()) return;
    this.removeHoveredClasses();
  }

  private removeHoveredClasses() {
    if(!this.hoveredStyles()) return;
    const element = this.el.nativeElement;
    this.renderer.removeClass(element, this.hoveredStyles());
  }

  private addHoveredClasses() {
    if(!this.hoveredStyles()) return;
    const element = this.el.nativeElement;
    this.renderer.addClass(element, this.hoveredStyles());
  }

  readonly  class = computed(() => {
    const base = 'px-3 py-1 rounded-lg transition-all z-5';
    const checked = this.checked() ? this.activeStyles() : ''; // if checked is true, apply active styles
    const disabled = this.finalDisabled() ? 'opacity-30 cursor-not-allowed' : '';
    return `${base} ${checked} ${disabled}`;
  });
}