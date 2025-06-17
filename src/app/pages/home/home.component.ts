import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/base/Button/button.component';
import { TitleDirective } from '../../directives/ui/title.directive';
import { TextDirective } from '../../directives/ui/text.directive';
import { CardSlider } from "../../components/shared/card-slider/card-slider.component";
import { CardReviewComponent } from '../../components/shared/review-card/card-review.component';
import { RecommendationCardComponent } from "../../components/layout/recommendation-card/recommendation-card.component";

@Component({
  selector: 'app-home',
  imports: [ButtonComponent, TitleDirective, TextDirective, CardSlider, CardReviewComponent, RecommendationCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
