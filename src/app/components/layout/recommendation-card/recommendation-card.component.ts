import { Component } from '@angular/core';
import { TitleDirective } from '../../../directives/ui/title.directive';
import { TextDirective } from '../../../directives/ui/text.directive';
import { RateComponent } from '../../shared/rate/rate.component';
import { ButtonComponent } from '../../base/Button/button.component';

@Component({
  selector: 'app-recommendation-card',
  host: {
    class: 'block bg-card text-card-fg rounded p-3 flex gap-4'
  },
  imports: [TextDirective, RateComponent, ButtonComponent],
  templateUrl: './recommendation-card.component.html',
})
export class RecommendationCardComponent {
  tags = [
    "Investigação", "Ação", "Aventura", "Ficção Científica",
    "Drama", "Comédia"
  ]
}
