import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, OnInit, signal, untracked } from '@angular/core';
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { ComboboxOption } from "../../components/shared/combobox/combobox.component";
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { SearchbarComponent } from "../../components/shared/searchbar/searchbar.component";
import { CardReviewComponent } from 'app/components/shared/card-review/card-review.component';
import PaginatorComponent from "../../components/shared/paginator/paginator.component";
import { Post, PaginatedPosts, PostQuery } from 'app/models/post.interface';

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
  private postCache: { [searchKey: string]: PaginatedPosts } = {};
  labelCategorias = signal('');
  labelAvaliacoes = signal('');
  categoryOptions = signal<ComboboxOption[]>([]);
  rateOptions = signal<ComboboxOption[]>(RATE_OPTIONS);
  totalPages = signal(0);
  searchQuery = signal<PostQuery>({ page: 1, pageSize: 8 });
  displayedPosts = signal<Post[]>([]);
  search = effect(() => { this.searchPost(); });
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadInitialPosts();
  }

  private searchPost() {
    const query = this.searchQuery(); // Get the current search query and track signal changes
    const treatedQuery: PostQuery = {
      page: query.page,
      pageSize: 8,
      search_text: query.search_text || '',
      minRate: query.minRate === 0 ? undefined : query.minRate,
      categoryIds: query.categoryIds && query.categoryIds.length > 0 ? query.categoryIds : undefined
    };
    untracked(() => { // Untrack this effect to avoid infinite loops
      this.handlePosts(treatedQuery);
    })
  }

  private setDumbOptions(activeRate?: number, activeCategories?: string[]) { // Update the active state of rate and category options
    this.rateOptions.update(options => {
      return options.map(option => ({
        ...option,
        active: option.value === activeRate?.toString()
      }));
    });
    this.categoryOptions.update(options => {
      return options.map(option => ({
        ...option,
        active: activeCategories?.includes(option.value)
      }));
    });
  }

  searchRateOptions(activeOptions: ComboboxOption[]) {
    const rate = parseInt(activeOptions[0]?.value || '0', 10);
    this.updateSearchRate(rate);
  }

  searchCategoriesOptions(activeOptions: ComboboxOption[]) {
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
    this.posts.searchPostsPage({ page: 1 }).then(value => {
      if (value.data) {
        this.displayedPosts.set(value.data.posts);
        this.totalPages.set(value.data.total_pages);
      }
    });
  }

  onPageChange(page: number) {
    this.searchQuery.update(currentSearch => {
      const updated: PostQuery = {
        ...currentSearch,
        page: page
      }
      return updated
    });
  }
  
  updateSearchBar(search: string) {
    clearTimeout(this.searchDebouceTimeout);
    this.searchDebouceTimeout = setTimeout(() => {
      this.searchQuery.update(currentSearch => {
        const updated: PostQuery = {
          ...currentSearch,
          search_text: search
        }
        return updated
      })
    }, 500);
  }

  private updateSearchCategories(categories: string[]) {
    this.searchQuery.update(currentSearch => {
      const updated: PostQuery = {
        ...currentSearch,
        categoryIds: categories
      }
      return updated
    });
  }

  private updateSearchRate(rate: number) {
    this.searchQuery.update(currentSearch => {
      const updated: PostQuery = {
        ...currentSearch,
        minRate: rate
      }
      return updated
    });
  }

    private handlePosts(search: PostQuery) {
    const cachedPosts = this.getCachedQuery(search);
    if (cachedPosts) {
      const totalPages = cachedPosts.total_pages;
      this.applySearch(cachedPosts, totalPages, search.minRate, search.categoryIds);
    } else {
      this.fetchPosts(search);
    }
  }
  
  private fetchPosts(query: PostQuery) {
    this.posts.searchPostsPage(query).then( ({ data, error }) => {
      if (data) {
        this.applySearch(data, data.total_pages, query.minRate, query.categoryIds);
        this.addPostToCache(query, data);
      }
    });
  }

  private applySearch(paginatedPost: PaginatedPosts, totalPages: number, rate?: number, categories?: string[]) {
    this.displayedPosts.set(paginatedPost.posts);
    this.totalPages.set(totalPages);
    this.setDumbOptions(rate, categories);
  }

  private getCachedQuery(search: PostQuery): PaginatedPosts | undefined {
    const key = JSON.stringify(search);
    return this.postCache[key];
  }

  private addPostToCache(search: PostQuery, posts: PaginatedPosts) {
    const key = JSON.stringify(search);
    this.postCache[key] = posts;
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
