import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/base/Button/button.component';
import { TitleDirective } from '../../directives/ui/title.directive';
import { TextDirective } from '../../directives/ui/text.directive';
import { ReviewCardSectionComponent } from "../../components/layout/review-card-section/review-card-section.component";

@Component({
  selector: 'app-home',
  imports: [ButtonComponent, TitleDirective, TextDirective, ReviewCardSectionComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
