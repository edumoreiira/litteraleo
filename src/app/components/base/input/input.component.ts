import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostListener, inject, input, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
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
    aria-invalid:border-destructive focus-visible:aria-invalid:ring-destructive/20"
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
export class InputComponent implements ControlValueAccessor, OnInit, OnDestroy{
  el = inject(ElementRef);
  // inputs
  identifier = input.required<string>();
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<InputTypes>('text');
  // signals
  value = signal('');
  invalid = signal(false);
  // viewchild
  inputRef = viewChild.required('input', { read: ElementRef });
  // 
  private mutationObserver!: MutationObserver


  ngOnInit(): void {
    // Initialize the input value from the control's value
    this.validateInputState();
  }

  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }


  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
    this.onTouched();
    this.value.set(value);
  }
  onBlur() {
    this.onTouched();
    this.validateInputState();
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

validateInputState() {
  const hostEl = this.el.nativeElement;
  let debounceTimeout: ReturnType<typeof setTimeout>

  this.mutationObserver = new MutationObserver(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => { // debounce to avoid multiple calls
      const currentClassList = hostEl.classList;
      if (currentClassList.contains('ng-invalid') && currentClassList.contains('ng-dirty')) {
        this.invalid.set(true);
      } else {
        this.invalid.set(false);
      }
    }, 50);
  });

  this.mutationObserver.observe(hostEl, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

}
