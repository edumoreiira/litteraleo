import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { PopOverDirective } from "app/directives/utils/pop-over.directive";

export type DropdownOption = 'edit' | 'delete';

@Component({
  selector: 'app-edit-content-dropdown',
  imports: [A11yModule, PopOverDirective],
  templateUrl: './edit-content-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [createAnimation('popConfig', { transform: 'scale(.95)', duration: '100ms' })],
})
export class EditContentDropdownComponent {
  popOver = viewChild.required(PopOverDirective);
  
  options = input<DropdownOption[]>(['edit', 'delete']);

  edit = output<void>();
  delete = output<void>();

  protected onEdit() {
    this.edit.emit();
    this.popOver().close();
  }

  protected onDelete() {
    this.delete.emit();
    this.popOver().close();
  }
}
