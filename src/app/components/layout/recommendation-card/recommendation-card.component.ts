import { Component, inject } from '@angular/core';
import { TitleDirective } from '../../../directives/ui/title.directive';
import { TextDirective } from '../../../directives/ui/text.directive';
import { RateComponent } from '../../shared/rate/rate.component';
import { ButtonComponent } from '../../base/Button/button.component';
import { DocumentListenerService } from '../../../services/platform/document-listener.service';

@Component({
  selector: 'app-recommendation-card',
  host: {
    class: 'block bg-card text-card-fg rounded p-2 flex gap-4 md:flex-row flex-col'
  },
  imports: [TextDirective, RateComponent, ButtonComponent],
  templateUrl: './recommendation-card.component.html',
})
export class RecommendationCardComponent {
  protected documentListener = inject(DocumentListenerService);
  tags = [
    "Investigação", "Ação", "Aventura", "Ficção Científica",
    "Drama", "Comédia"
  ]
}
