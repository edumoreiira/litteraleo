import { Component, ElementRef, forwardRef, input, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
    [for]="identifier()">{{ label() }}</label>
    <input 
    class="w-full px-3 py-1.5 border border-input rounded-lg outline-none placeholder:text-muted-fg text-fg text-sm shadow-xs
    focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/20 transition-all"
    #input 
    [id]="identifier()"
    [type]="type()"
    [placeholder]="placeholder()"
    (input)="onInput($event)">
  `,
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor{
  // inputs
  identifier = input.required<string>();
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<InputTypes>('text')
  // 
  value = signal('');
  inputRef = viewChild.required('input', { read: ElementRef });



  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
    this.onTouched();
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

}
