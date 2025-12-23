import { Component } from '@angular/core';
import { SOCIALS } from 'app/constants/app.constants';
import { TextDirective } from 'app/directives/ui/text.directive';
import { TitleDirective } from 'app/directives/ui/title.directive';

@Component({
  selector: 'app-about-me',
  host: {
    class: 'flex lg:flex-row flex-col lg:text-start text-center items-center lg:gap-12 gap-6'
  },
  imports: [TitleDirective, TextDirective],
  templateUrl: './about-me.component.html'
})
export class AboutMeComponent {
  socials = SOCIALS;
}
