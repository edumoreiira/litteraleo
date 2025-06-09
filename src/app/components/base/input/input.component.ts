import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostListener, inject, input, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

type InputTypes = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
@Component({
  selector: 'app-input',
  imports: [],
  host: {
    class: 'inline-block'
  },
  template: `
    <label
    class="font-medium text-sm leading-none mb-2 block" 
    [for]="identifier()"> 
      {{ label() }}
    </label>
    <input 
    [attr.aria-invalid]="invalid() ? 'true' : 'false'"
    class="w-full px-3 py-1.5 border border-input rounded-lg outline-none placeholder:text-muted-fg text-fg text-sm shadow-xs
    focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/20 transition-all
    disabled:cursor-not-allowed disabled:opacity-50
    aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-[3px]"
    #input 
    [id]="identifier()"
    [type]="type()"
    [value]="value()"
    [placeholder]="placeholder()"
    (blur)="onBlur()"
    (input)="onInput($event)">

  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor{
  el = inject(ElementRef);
  // inputs
  identifier = input.required<string>();
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<InputTypes>('text');
  setInvalid = input<boolean>(false);
  // signals
  value = signal('');
  invalid = signal(false);
  // viewchild
  inputRef = viewChild.required('input', { read: ElementRef });



  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
    this.onTouched();
    this.value.set(value);
  }
  onBlur() {
    this.onTouched();
    this.checkValidity();
  }
  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouched: any = () => {};
  writeValue(value: any): void {
    this.value.set(value); 
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (this.inputRef()) {
      this.inputRef().nativeElement.disabled = isDisabled;
    }
  }

  private checkValidity() {
    const hostEl = this.el.nativeElement;
    if(this.value() === '') {
      this.invalid.set(false);
      return;
    }
    this.invalid.set(hostEl.classList.contains('ng-invalid') && hostEl.classList.contains('ng-dirty'));
  }
}
