import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, OnInit, signal, untracked, viewChild } from '@angular/core';
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { ComboboxOption } from "../../components/shared/combobox/combobox.component";
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { SearchbarComponent } from "../../components/shared/searchbar/searchbar.component";
import { CardReviewComponent } from 'app/components/shared/card-review/card-review.component';
import PaginatorComponent from "../../components/shared/paginator/paginator.component";
import { Post, PaginatedPosts, PostQuery } from 'app/models/post.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';

const RATE_OPTIONS: ComboboxOption[] = [
  { label: '1 Estrela', value: '1' },
  { label: '2 Estrelas', value: '2' },
  { label: '3 Estrelas', value: '3' },
  { label: '4 Estrelas', value: '4' },
  { label: '5 Estrelas', value: '5' }
];

@Component({
  selector: 'app-resenhas',
  standalone: true,
  imports: [ButtonComponent, ComboboxDirective, SearchbarComponent, CardReviewComponent, PaginatorComponent, RouterLink],
  templateUrl: './resenhas.component.html',
  animations: [createAnimation('popUp', { animateY: true, transform: 'scale(.95)' })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResenhasComponent implements OnInit {
  private posts = inject(UserPostsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private searchDebouceTimeout: any;
  private postCache: { [searchKey: string]: PaginatedPosts } = {};
  private isInitializing = true;
  labelCategorias = signal('');
  labelAvaliacoes = signal('');
  categoryOptions = signal<ComboboxOption[]>([]);
  rateOptions = signal<ComboboxOption[]>(RATE_OPTIONS);
  totalPages = signal(0);
  searchQuery = signal<PostQuery>({ page: 1, pageSize: 8 });
  displayedPosts = signal<Post[]>([]);
  private search = effect(() => { this.searchPost(); });
  protected paginator = viewChild.required(PaginatorComponent);

  ngOnInit(): void {
    this.loadCategories();
    this.initializeFromUrl();
  }

  private initializeFromUrl() {
    this.route.queryParams
    .pipe(take(1))
    .subscribe(params => {
      const query: PostQuery = {
        page: params['page'] ? parseInt(params['page'], 10) : 1,
        pageSize: 8,
        search_text: params['search'] || undefined,
        minRate: params['rate'] ? parseInt(params['rate'], 10) : undefined,
        categoryIds: params['categories'] ? params['categories'].split(',') : undefined
      };
      this.searchQuery.set(query);
      this.isInitializing = false;
    });
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
      this.paginator().selectPage(query.page, false); // it keeps the paginator in sync with the search query
      if (!this.isInitializing) {
        this.updateUrl(treatedQuery);
      }
    })
  }

  private updateUrl(query: PostQuery) {
    const queryParams: any = {};
    
    if (query.page && query.page > 1) {
      queryParams['page'] = query.page;
    }
    if (query.search_text && query.search_text.trim() !== '') {
      queryParams['search'] = query.search_text;
    }
    if (query.minRate && query.minRate > 0) {
      queryParams['rate'] = query.minRate;
    }
    if (query.categoryIds && query.categoryIds.length > 0) {
      queryParams['categories'] = query.categoryIds.join(',');
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true
    });
  }

  private setDumbOptions(activeRate?: number, activeCategories?: string[]) { // Update the active state of rate and category options
    this.rateOptions.update(options => {
      return options.map(option => ({
        ...option,
        active: option.value === activeRate?.toString(),
        loading: false
      }));
    });
    this.categoryOptions.update(options => {
      return options.map(option => ({
        ...option,
        active: activeCategories?.includes(option.value),
        loading: false
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
          search_text: search,
          page: 1 // reset to first page on new search
        }
        return updated
      })
    }, 500);
  }

  private updateSearchCategories(categories: string[]) {
    this.searchQuery.update(currentSearch => {
      const updated: PostQuery = {
        ...currentSearch,
        categoryIds: categories,
        page: 1 // reset to first page on new search
      }
      return updated
    });
  }

  private updateSearchRate(rate: number) {
    this.searchQuery.update(currentSearch => {
      const updated: PostQuery = {
        ...currentSearch,
        minRate: rate,
        page: 1 // reset to first page on new search
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
}
