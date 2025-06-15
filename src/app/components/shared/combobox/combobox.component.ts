import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createAnimation, createQueryAnimations } from 'app/angular-animations/animations.utils';
export interface ComboboxOption {
  label: string;
  value: any;
  active: boolean;
}
@Component({
  selector: 'app-combobox',
  host: {
    '[@queryAnimationCombobox]': ''
  },
  templateUrl: './combobox.component.html',
  imports: [FormsModule, NgClass],
  animations: [
    createAnimation('fadeOption', { animateY: true, duration: '100ms' }),
    createAnimation('popUpCombobox', { animateY: true, transform: 'scale(.95)' }),
    createQueryAnimations('queryAnimationCombobox', '@popUpCombobox')
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboboxComponent implements OnInit, OnDestroy {
  readonly _comboboxOptions = input.required<ComboboxOption[]>({ alias: 'options'});
  readonly allowMultipleOptions = input<boolean>(false);

  updatedLabel = output<string>();
  activeOptions = output<ComboboxOption[]>();
  searchValue = signal('');
  comboboxOptions = signal<ComboboxOption[]>([]);
  lastComboboxOptions = output<ComboboxOption[]>();

  readonly filteredOptions = computed(() => {
    const search = this.searchValue().toLowerCase().trim();
    return this.comboboxOptions().filter(option =>
      option.label.toLowerCase().includes(search)
    );
  });


  updateComboboxOnInputChange = effect(() => {
    this.comboboxOptions.set(this._comboboxOptions());
  })

  ngOnInit(): void {
    this.comboboxOptions.set(this._comboboxOptions());
  }

  ngOnDestroy(): void {
    this.lastComboboxOptions.emit(this.comboboxOptions());
  }

  // allow multiple options
  handleMultipleOptions(option: ComboboxOption) {
    this.comboboxOptions.update((current) => 
      current.map((item) => item.value === option.value ? { ...item, active: !item.active } : item)
    );
    this.emitActiveOptions()
    this.updateLabel();
  }

  handleSingleOption(option: ComboboxOption) {
    this.comboboxOptions.update((current) => 
      current.map(item => item.value === option.value ? 
        { ...item, active: !item.active } :
        item.active ? { ...item, active: false } : item
      )
    )
    this.emitActiveOptions()
    this.updateLabel();
  }

  private emitActiveOptions() {
    const activeOptionsArr = this.comboboxOptions().filter(item => item.active);
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



  //snippets
}
