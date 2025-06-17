import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createAnimation, createQueryAnimations } from 'app/angular-animations/animations.utils';
import { ClickOutsideDirective } from 'app/directives/behavior/click-outside.directive';
export interface ComboboxOption {
  label: string;
  value: any;
  active: boolean;
}

export type CustomWidth = `${number}${'px' | 'rem' | 'em' | '%' | 'vw' | 'vh'}`;
@Component({
  selector: 'app-combobox',
  host: {
    '[@queryAnimationCombobox]': ''
  },
  hostDirectives: [{
    directive: ClickOutsideDirective,
    outputs: ['clickOutside']
  }],
  templateUrl: './combobox.component.html',
  imports: [FormsModule, NgClass, NgStyle],
  animations: [
    createAnimation('fadeOption', { animateY: true, duration: '100ms' }),
    createAnimation('popUpCombobox', { animateY: true, transform: 'scale(.95)' }),
    createAnimation('iconPopUp', { transform: 'scale(.2)'}),
    createQueryAnimations('queryAnimationCombobox', '@popUpCombobox')
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboboxComponent implements OnInit, OnDestroy {
  private clickOutsideDirective = inject(ClickOutsideDirective);
  // 
  readonly _comboboxOptions = input.required<ComboboxOption[]>({ alias: 'options'});
  readonly allowMultipleOptions = input<boolean>(false);
  readonly dumbComponent = input<boolean>(false);
  customWidth = input<CustomWidth>();

  updatedLabel = output<string>();
  activeOptions = output<ComboboxOption[]>();
  searchValue = signal('');
  comboboxOptions = signal<ComboboxOption[]>([]);
  lastComboboxOptions = output<ComboboxOption[]>();
  clickOutside = output<void>();

  readonly filteredOptions = computed(() => {
    const search = this.searchValue().toLowerCase().trim();
    return this.comboboxOptions().filter(option =>
      option.label.toLowerCase().includes(search)
    );
  });


  updateComboboxOnInputChange = effect(() => {
    this.comboboxOptions.set(this._comboboxOptions());
  })

  constructor() {
    this.clickOutsideDirective.clickOutside.subscribe(() => {
      this.clickOutside.emit();
    });
  }

  ngOnInit(): void {
    this.comboboxOptions.set(this._comboboxOptions());
  }

  ngOnDestroy(): void {
    this.lastComboboxOptions.emit(this.comboboxOptions());
  }

  handleOptionSelection(option: ComboboxOption) {
    const updatedOptions = this.allowMultipleOptions() 
      ? this.handleMultipleSelection(option)
      : this.handleSingleSelection(option);

    if (this.dumbComponent()) {
      this.emitActiveOptions(updatedOptions);
    } else {
      this.comboboxOptions.set(updatedOptions);
      this.emitActiveOptions(updatedOptions);
      this.updateLabel();
    }
  }

  // allow multiple options
  private handleMultipleSelection(option: ComboboxOption): ComboboxOption[] {
    return this.comboboxOptions().map(item =>
      item.value === option.value 
        ? { ...item, active: !item.active } 
        : item
    );
  }

  private handleSingleSelection(option: ComboboxOption): ComboboxOption[] {
    return this.comboboxOptions().map(item => ({
      ...item,
      active: item.value === option.value ? !item.active : false
    }));
  }

  private emitActiveOptions(optionsArr: ComboboxOption[]) {
    const activeOptionsArr = optionsArr.filter(item => item.active);
    this.activeOptions.emit(activeOptionsArr);
  }

  updateLabel() {
    const activeOptions = this.comboboxOptions().filter(item => item.active);
    if (activeOptions.length > 0) {
      this.updatedLabel.emit(activeOptions.map(item => item.label).join(', '));
    } else {
      this.updatedLabel.emit('initial');
    }
  }
}
