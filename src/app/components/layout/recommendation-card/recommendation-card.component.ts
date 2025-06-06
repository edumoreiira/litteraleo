import { AfterViewChecked, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { TitleDirective } from '../../../directives/ui/title.directive';
import { TextDirective } from '../../../directives/ui/text.directive';
import { RateComponent } from '../../shared/rate/rate.component';
import { ButtonComponent } from '../../base/Button/button.component';
import { DocumentListenerService } from '../../../services/platform/document-listener.service';

@Component({
  selector: 'app-recommendation-card',
  host: {
    class: 'bg-card text-card-fg rounded p-2 flex gap-4 md:flex-row flex-col'
  },
  imports: [TextDirective, RateComponent, ButtonComponent],
  templateUrl: './recommendation-card.component.html',
})
export class RecommendationCardComponent implements AfterViewChecked {
  protected documentListener = inject(DocumentListenerService);
  imgContainer = viewChild.required('imgContainer', { read: ElementRef<HTMLDivElement> });
  description = input<string>() // max 1000 characters
  tags = [
    "Investigação", "Ação", "Aventura", "Ficção Científica",
    "Drama", "Comédia"
  ]

  ngAfterViewChecked(): void {
    const imgContainer = this.imgContainer().nativeElement as HTMLDivElement;
    const height = imgContainer.offsetHeight;
    const width = height / 1.5; // 1.5 is the aspect ratio (height / width)
    imgContainer.style.width = `${width}px`;
    imgContainer.style.minWidth = `${width}px`;
  }
}
