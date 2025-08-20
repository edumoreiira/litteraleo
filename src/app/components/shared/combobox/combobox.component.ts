import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, OnChanges, OnDestroy, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createAnimation, createQueryAnimations } from 'app/angular-animations/animations.utils';
import { ClickOutsideDirective } from 'app/directives/utils/click-outside.directive';

export interface ComboboxOption {
  label: string;
  value: string;
  loading?: boolean;
  active?: boolean;
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
    createAnimation('iconPopUp', { animateY: true, animateX: true, transform: 'scale(.2)' }),
    createQueryAnimations('queryAnimationCombobox', '@popUpCombobox')
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboboxComponent {
  private clickOutsideDirective = inject(ClickOutsideDirective);
  // 
  loadingTimeout: any;
  readonly comboboxOptions = model.required<ComboboxOption[]>({ alias: 'options'});
  readonly allowMultipleOptions = input<boolean>(false);
  readonly dumbComponent = input<boolean>(false);
  readonly searchable = input<boolean>(true);
  customWidth = input<CustomWidth>();
  minWidth = input<CustomWidth>();

  updatedLabel = output<string>();
  activeOptions = output<ComboboxOption[]>();
  searchValue = signal('');
  isLoadingForSeconds = signal(false);
  clickOutside = output<void>();
  
  readonly filteredOptions = computed(() => {
    const search = this.searchValue().toLowerCase().trim();
    return this.comboboxOptions().filter(option =>
      option.label.toLowerCase().includes(search)
    );
  });
  setLoadingForSecondsStateOffAfterChanges = effect(() => {
    if(!this.isLoading()) { // triggers on comboboxOptions change
      this.isLoadingForSeconds.set(false);
      clearTimeout(this.loadingTimeout); // clear loading timeout
    }
  })

  constructor() {
    this.clickOutsideDirective.clickOutside.subscribe(() => {
      this.clickOutside.emit();
    });
  }

  handleOptionSelection(option: ComboboxOption) {
    if (this.isLoading()) return; // prevent selection if any option is loading to avoid race condition issues.

    const updatedOptions = this.allowMultipleOptions() 
      ? this.handleMultipleSelection(option)
      : this.handleSingleSelection(option);

    if (this.dumbComponent()) {
      option.loading = true; // set loading state on dumb component
      this.emitActiveOptions(updatedOptions);
      this.loadingTimeout = setTimeout(() => {
        if(this.isLoading()) this.isLoadingForSeconds.set(true); // triggers after 500 ms - is cancelled if a new option is selected
      }, 500);

    } else {
      this.comboboxOptions.set(updatedOptions);
      this.emitActiveOptions(updatedOptions);
      this.updateLabel();
    }
  }

  isLoading(): boolean {
    return this.comboboxOptions().some(option => option.loading === true);
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
