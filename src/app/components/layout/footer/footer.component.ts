import { Component } from '@angular/core';
import { SOCIALS } from 'app/constants/app.constants';

@Component({
  selector: 'footer[app-footer]',
  host: {
    class: 'py-8 text-primary-500 border-t border-border/40 mt-auto'
  },
  imports: [],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  socials = SOCIALS;
}
