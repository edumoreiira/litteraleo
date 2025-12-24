import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { PopOverDirective } from "app/directives/utils/pop-over.directive";

@Component({
  selector: 'app-edit-content-dropdown',
  imports: [A11yModule, PopOverDirective],
  templateUrl: './edit-content-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [createAnimation('popConfig', { transform: 'scale(.95)', duration: '100ms' })],
})
export class EditContentDropdownComponent {
  edit = output<void>();
  delete = output<void>();
}
