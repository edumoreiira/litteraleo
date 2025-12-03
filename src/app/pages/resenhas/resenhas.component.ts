import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { ComboboxOption } from "../../components/shared/combobox/combobox.component";
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { SearchbarComponent } from "../../components/shared/searchbar/searchbar.component";
import { CardReviewComponent } from 'app/components/shared/card-review/card-review.component';
import PaginatorComponent from "../../components/shared/paginator/paginator.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { PaginatedReviews, Review, ReviewSearchParams } from 'app/models/review.interface';

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
  private reviews = inject(ReviewsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private searchDebouceTimeout: any;
  private postCache: { [searchKey: string]: PaginatedReviews } = {};
  private isInitializing = true;
  labelCategorias = signal('');
  labelAvaliacoes = signal('');
  categoryOptions = signal<ComboboxOption[]>([]);
  rateOptions = signal<ComboboxOption[]>(RATE_OPTIONS);
  totalPages = signal(0);
  searchQuery = signal<ReviewSearchParams>({ page: 1, page_size: 8 });
  dispslayedReviews = signal<Review[]>([]);
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
      const query: ReviewSearchParams = {
        page: params['page'] ? parseInt(params['page'], 10) : 1,
        page_size: 8,
        search_text: params['search'] || undefined,
        rating: params['rate'] ? parseInt(params['rate'], 10) : undefined,
        category_ids: params['categories'] ? params['categories'].split(',') : undefined
      };
      this.searchQuery.set(query);
      this.isInitializing = false;
    });
  }

  private searchPost() {
    console.log('Search query changed, performing search...');
    const query = this.searchQuery(); // Get the current search query and track signal changes
    const treatedQuery: ReviewSearchParams = {
      page: query.page,
      page_size: 8,
      search_text: query.search_text || '',
      rating: query.rating === 0 ? undefined : query.rating,
      category_ids: query.category_ids && query.category_ids.length > 0 ? query.category_ids : undefined
    };
    untracked(() => { // Untrack this effect to avoid infinite loops
      this.handlePosts(treatedQuery);
      this.paginator().selectPage(query.page, false); // it keeps the paginator in sync with the search query
      if (!this.isInitializing) {
        this.updateUrl(treatedQuery);
      }
    })
  }

  private updateUrl(query: ReviewSearchParams) {
    const queryParams: any = {};
    
    if (query.page && query.page > 1) {
      queryParams['page'] = query.page;
    }
    if (query.search_text && query.search_text.trim() !== '') {
      queryParams['search'] = query.search_text;
    }
    if (query.rating && query.rating > 0) {
      queryParams['rate'] = query.rating;
    }
    if (query.category_ids && query.category_ids.length > 0) {
      queryParams['categories'] = query.category_ids.join(',');
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
      const updated: ReviewSearchParams = {
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
        const updated: ReviewSearchParams = {
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
      const updated: ReviewSearchParams = {
        ...currentSearch,
        category_ids: categories,
        page: 1 // reset to first page on new search
      }
      return updated
    });
  }

  private updateSearchRate(rate: number) {
    this.searchQuery.update(currentSearch => {
      const updated: ReviewSearchParams = {
        ...currentSearch,
        rating: rate,
        page: 1 // reset to first page on new search
      }
      return updated
    });
  }

  private handlePosts(search: ReviewSearchParams) {
    console.log('Handling posts with search params:', search);
    const cachedPosts = this.getCachedQuery(search);
    if (cachedPosts) {
      console.log('Using cached posts:', cachedPosts);
      const totalPages = cachedPosts.total_pages;
      this.applySearch(cachedPosts, totalPages, search.rating, search.category_ids);
    } else {
      console.log('Fetching posts from server...');
      this.fetchPosts(search);
    }
  }
  
  private fetchPosts(query: ReviewSearchParams) {
    console.log('Fetching posts with query:', query);
    this.reviews.searchReviews(query).then( ({ data, error }) => {
      if (data) {
        console.log('Fetched posts:', data);
        this.applySearch(data, data.total_pages, query.rating, query.category_ids);
        this.addReviewToCache(query, data);
      }
      if (error) {
        console.error('Error fetching posts:', error);
      }
    });
  }

  private applySearch(paginatedReviews: PaginatedReviews, totalPages: number, rate?: number, categories?: string[]) {
    console.log('Reviews encontradas:', paginatedReviews);
    this.dispslayedReviews.set(paginatedReviews.reviews);
    this.totalPages.set(totalPages);
    this.setDumbOptions(rate, categories);
  }

  private getCachedQuery(search: ReviewSearchParams): PaginatedReviews | undefined {
    const key = JSON.stringify(search);
    return this.postCache[key];
  }

  private addReviewToCache(search: ReviewSearchParams, reviews: PaginatedReviews) {
    const key = JSON.stringify(search);
    this.postCache[key] = reviews;
  }
}
