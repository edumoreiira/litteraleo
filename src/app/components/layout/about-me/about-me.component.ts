import { Component } from '@angular/core';
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
  socials = [
    { name: 'Instagram', icon: 'fi-brands-instagram', url: 'https://www.instagram.com/@litteraleo/' },
    { name: 'Youtube', icon: 'fi-brands-youtube', url: 'https://www.youtube.com/@litteraleo' },
    { name: 'Medium', icon: 'fi-brands-medium', url: 'https://litteraleo.medium.com/' },
  ]
}
