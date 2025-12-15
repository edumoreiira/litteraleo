import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { TextDirective } from 'app/directives/ui/text.directive';
import { TitleDirective } from 'app/directives/ui/title.directive';

@Component({
  selector: 'app-hero',
  imports: [TextDirective, TitleDirective],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  private router = inject(Router);

  onSubmit(searchText: string) {
    this.router.navigate(['/resenhas'], { queryParams: { search: searchText, search_type: 'both' } });
  }

}
