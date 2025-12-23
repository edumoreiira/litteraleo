import { Component } from '@angular/core';
import { SOCIALS } from 'app/constants/app.constants';
import { TitleDirective } from 'app/directives/ui/title.directive';

@Component({
  selector: 'footer[app-footer]',
  imports: [TitleDirective],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  socials = SOCIALS;
}
