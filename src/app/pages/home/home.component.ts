import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/base/Button/button.component';
import { TitleDirective } from '../../directives/ui/title.directive';
import { TextDirective } from '../../directives/ui/text.directive';

@Component({
  selector: 'app-home',
  imports: [ButtonComponent, TitleDirective, TextDirective],
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
