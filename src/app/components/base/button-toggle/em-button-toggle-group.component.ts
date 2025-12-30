import {
  AfterContentInit,
  Component,
  forwardRef,
  input,
  signal,
  effect,
  model,
  contentChildren,
  ChangeDetectionStrategy,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  EmButtonToggleChange,
  EmButtonToggleDirective,
} from './em-button-toggle.directive';

@Component({
  selector: 'em-button-toggle-group',
  standalone: true,
  host: {
    class: 'p-1 border border-border rounded inline-flex relative overflow-auto max-w-full justify-between bg-white',
    role: 'radiogroup',
    '[attr.name]': 'name()',
    '[attr.aria-disabled]': 'disabled()',
  },
  styleUrl: './em-button-toggle-group.component.scss',
  imports: [],
  template: `<ng-content></ng-content>`,

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmButtonToggleGroupComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmButtonToggleGroupComponent
  implements ControlValueAccessor, AfterContentInit
{
  readonly multiple = input<boolean>(false);
  readonly name = input.required<string>();

  // internal disabled state, controlled by forms api or input
  readonly disabled = model(false);
  readonly buttons = contentChildren(EmButtonToggleDirective);

  // internal value signal
  private value = signal<any | any[] | null>(null);
  public readonly $value = this.value.asReadonly();
  public readonly change = output<any | any[] | null>();


  // cva functions
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    // whenever the name of the group changes, propagate those changes to all child buttons
    effect(() => {
      this.syncButtonNames();
    });
  }

  ngAfterContentInit(): void {
    this.initializeValueFromCheckedButtons();
    this.subscribeToButtonChanges();
  }

  // --- controlvalueaccessor implementation ---

  writeValue(value: any): void {
    // receives value from the forms api and updates the internal signal
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // --- internal logic ---

  private initializeValueFromCheckedButtons(): void {
    const checkedButtons = this.buttons().filter((button) => button.checked());
    if (checkedButtons.length === 0) return;

    if (this.multiple()) {
      const initialValue = checkedButtons.map((button) => button.value());
      this.value.set(initialValue);
    } else {
      // if multiple buttons are checked declaratively in single-select mode,
      // the last one wins.
      const initialValue = checkedButtons[checkedButtons.length - 1].value();
      this.value.set(initialValue);
    }

    // notify forms api of the initial value
    this.onChange(this.value());
  }

  private subscribeToButtonChanges(): void {
    this.buttons().forEach((button) => {
      button.selectionChange.subscribe((change: EmButtonToggleChange) => {
        this.onButtonSelectionChange(change);
        this.change.emit(this.value());
      });
    });
  }

  private onButtonSelectionChange(change: EmButtonToggleChange): void {
    this.onTouched();
    const { value } = change;
    let newValue: any | any[];

    if (this.multiple()) {
      const current = Array.isArray(this.value())
        ? [...(this.value() as any[])]
        : [];
      const index = current.indexOf(value);

      if (index > -1) {
        current.splice(index, 1); // unselect
      } else {
        current.push(value); // select
      }
      newValue = current;
    } else {
      newValue = value;
    }
    this.value.set(newValue);
    this.onChange(newValue);
  }

  private syncButtonNames() {
    const groupName = this.name();
    this.buttons().forEach((button) => {
      // propagate the name state reactively
      button.name.set(groupName);
    });
  }
}
