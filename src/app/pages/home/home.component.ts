import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/base/Button/button.component';
import { TitleDirective } from '../../directives/ui/title.directive';
import { TextDirective } from '../../directives/ui/text.directive';
import { CardSlider } from "../../components/shared/card-slider/card-slider.component";
import { ReviewCardComponent } from '../../components/shared/review-card/review-card.component';
import { RecommendationCardComponent } from "../../components/layout/recommendation-card/recommendation-card.component";

@Component({
  selector: 'app-home',
  imports: [ButtonComponent, TitleDirective, TextDirective, CardSlider, ReviewCardComponent, RecommendationCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
