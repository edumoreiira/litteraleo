import { Component } from '@angular/core';
import { SOCIALS } from 'app/constants/app.constants';

@Component({
  selector: 'footer[app-footer]',
  host: {
    class: 'py-8 page-container text-primary-500 flex flex-col sm:flex-row justify-between items-center sm:gap-6 gap-4 border-t border-border/40 flex-wrap mt-auto'
  },
  imports: [],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  socials = SOCIALS;
}
