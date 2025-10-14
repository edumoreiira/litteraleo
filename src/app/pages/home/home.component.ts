import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../components/base/Button/button.component';
import { TitleDirective } from '../../directives/ui/title.directive';
import { TextDirective } from '../../directives/ui/text.directive';
import { CardSlider } from "../../components/shared/card-slider/card-slider.component";
import { CardReviewComponent } from '../../components/shared/card-review/card-review.component';
import { RecommendationCardComponent } from "../../components/layout/recommendation-card/recommendation-card.component";
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { Post } from 'app/models/post.interface';

@Component({
  selector: 'app-home',
  imports: [ButtonComponent, TitleDirective, TextDirective, CardSlider, CardReviewComponent, RecommendationCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{
  private posts = inject(UserPostsService);
  protected latestPosts = signal<Post[]>([]);

  ngOnInit(): void {
    this.getLatestPosts();
  }

  private getLatestPosts() {
    this.posts.searchPostsPage({ page: 1, pageSize: 5}).then(({ data, error}) => {
      if(data) {
        this.latestPosts.set(data.posts);
      }
    })
  }

}
