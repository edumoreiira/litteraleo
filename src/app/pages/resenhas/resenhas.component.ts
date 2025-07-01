import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { ComboboxOption } from "../../components/shared/combobox/combobox.component";
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { SearchbarComponent } from "../../components/shared/searchbar/searchbar.component";
import { CardReviewComponent } from 'app/components/shared/card-review/card-review.component';
import PaginatorComponent from "../../components/shared/paginator/paginator.component";
import { Post } from 'app/models/post.interface';

type PostSearch = {
  page: number;
  categories?: string[];
  rate?: string;
  search?: string;
}

const RATE_OPTIONS: ComboboxOption[] = [
  { label: '1 Estrela', value: '1' },
  { label: '2 Estrelas', value: '2' },
  { label: '3 Estrelas', value: '3' },
  { label: '4 Estrelas', value: '4' },
  { label: '5 Estrelas', value: '5' }
];

@Component({
  selector: 'app-resenhas',
  imports: [ButtonComponent, ComboboxDirective, SearchbarComponent, CardReviewComponent, PaginatorComponent],
  templateUrl: './resenhas.component.html',
  animations: [createAnimation('popUp', { animateY: true, transform: 'scale(.95)' })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResenhasComponent implements OnInit {
  private posts = inject(UserPostsService);
  private searchDebouceTimeout: any;
  labelCategorias = signal('');
  labelAvaliacoes = signal('');
  isComboboxOpen = signal(false);
  categoryOptions = signal<ComboboxOption[]>([]);
  rateOptions = signal<ComboboxOption[]>(RATE_OPTIONS);
  totalPages = signal(0);
  searchQuery = signal<PostSearch>({ page: 1 });
  displayedPosts = signal<Post[]>([]);
  search = effect(() => { this.searchPost(); })
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadInitialPosts();
  }

  private searchPost() {
    const query = this.searchQuery(); // Get the current search query and track signal changes
    const rate = query.rate ? parseInt(query.rate) : undefined;
    const categories = query.categories && query.categories.length > 0 ? query.categories : undefined;
    this.posts.searchPostsPage(query.page, 8, query.search, rate, categories).then( ({ data, error }) => {
      if (data) {
        this.displayedPosts.set(data.posts);
        this.totalPages.set(data.totalPages);
      }
    });
  }

  toggleComboboxOpen() {
    this.isComboboxOpen.update(state => !state);
  }

  updateRateOptions(activeOptions: ComboboxOption[]) {
    this.rateOptions.update(options => {
      return options.map(option => ({
        ...option,
        active: activeOptions.some(activeOption => activeOption.value === option.value)
      }));
    })
    this.updateSearchRate(activeOptions[0]?.value || '');
  }

  searchCategories(activeOptions: ComboboxOption[]) {
    this.updateSearchCategories(activeOptions.map(option => option.value));
  }

  async loadCategories() {
    await this.posts.getAllCategories().then(categories => {
      this.categoryOptions.set(
        categories.map((category, i) => ({
          label: category.name,
          value: category.id
        }))
      );
    });
  }

  async loadInitialPosts() {
    this.posts.searchPostsPage(1).then(value => {
      if (value.data) {
        this.displayedPosts.set(value.data.posts);
        this.totalPages.set(value.data.totalPages);
      }
    });
  }

  onPageChange(page: number) {
    this.searchQuery.update(currentSearch => ({
      ...currentSearch,
      page: page
    }));
  }
  
  updateSearchBar(search: string) {
    clearTimeout(this.searchDebouceTimeout);
    this.searchDebouceTimeout = setTimeout(() => {
      this.searchQuery.update(currentSearch => ({
        ...currentSearch,
        search: search
      }));
    }, 500);
  }

  updateSearchCategories(categories: string[]) {
    this.searchQuery.update(currentSearch => ({
      ...currentSearch,
      categories: categories
    }));
  }

  updateSearchRate(rate: string) {
    this.searchQuery.update(currentSearch => ({
      ...currentSearch,
      rate: rate
    }));
  }

    
  // embaralhar() {
  //   this.rateOptions.set(
  //     [
  //       { label: 'Opcao 43', value: 'opcao43', active: true },
  //       { label: 'Opcao 44', value: 'opcao44', active: false }
  //     ]
  //   )
  //   this.categoryOptions.set(
  //     [
  //       { label: 'Categoria 1', value: 'categoria1', active: true },
  //       { label: 'Categoria 2', value: 'categoria2', active: false },
  //       { label: 'Categoria 3', value: 'categoria3', active: false }
  //     ]
  //   );
  // }
}
