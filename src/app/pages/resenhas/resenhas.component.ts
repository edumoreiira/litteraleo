import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { ComboboxOption } from "../../components/shared/combobox/combobox.component";
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { SearchbarComponent } from "../../components/shared/searchbar/searchbar.component";
import { CardReviewComponent } from 'app/components/shared/card-review/card-review.component';
import PaginatorComponent from "../../components/shared/paginator/paginator.component";

@Component({
  selector: 'app-resenhas',
  imports: [ButtonComponent, ComboboxDirective, SearchbarComponent, CardReviewComponent, PaginatorComponent],
  templateUrl: './resenhas.component.html',
  animations: [createAnimation('popUp', { animateY: true, transform: 'scale(.95)' })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResenhasComponent implements OnInit {
  private posts = inject(UserPostsService);
  labelCategorias = signal('');
  labelAvaliacoes = signal('');
  isComboboxOpen = signal(false);

  categoryOptions = signal<ComboboxOption[]>([]);
  
  rateOptions = signal<ComboboxOption[]>([
    { label: '1 Estrela', value: '1' },
    { label: '2 Estrelas', value: '2' },
    { label: '3 Estrelas', value: '3' },
    { label: '4 Estrelas', value: '4' },
    { label: '5 Estrelas', value: '5' }
  ]);

  ngOnInit(): void {
    this.loadCategories();
  }


  toggleComboboxOpen() {
    this.isComboboxOpen.update(state => !state);
  }

  async loadCategories() {
    await this.posts.getAllCategories().then(categories => {
      this.categoryOptions.set(
        categories.map((category, i) => ({
          label: category.name,
          value: i.toString(),
        }))
      );
    });
  }

  updateOptions(activeOptions: ComboboxOption[]) {
    this.rateOptions.update(options => {
      return options.map(option => ({
        ...option,
        active: activeOptions.some(activeOption => activeOption.value === option.value)
      }));
    })
  }


  embaralhar() {
    this.rateOptions.set(
      [
        { label: 'Opcao 43', value: 'opcao43', active: true },
        { label: 'Opcao 44', value: 'opcao44', active: false }
      ]
    )
    this.categoryOptions.set(
      [
        { label: 'Categoria 1', value: 'categoria1', active: true },
        { label: 'Categoria 2', value: 'categoria2', active: false },
        { label: 'Categoria 3', value: 'categoria3', active: false }
      ]
    );
  }

  logOptions(options: ComboboxOption[]) {
    console.log('Selected options:', options);
  }
}
