import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { InputComponent } from 'app/components/base/input/input.component';
import { ComboboxOption } from 'app/components/shared/combobox/combobox.component';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { QuillModule } from 'ngx-quill';
import { RateComponent } from "../../shared/rate/rate.component";
import { NgxMaskDirective } from 'ngx-mask';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { BooksAndCategories, CreateReviewDTO, Review, ReviewForm, UpdateReviewDTO } from 'app/models/review.interface';
import { ModalService } from 'app/services/ui/modal.service';
import { LibraryManagerComponent } from 'app/components/dialogs/library-manager/library-manager.component';
import { Router } from '@angular/router';
import { EDITOR_MODULES } from 'app/config/quill-config';
import { ContentCacheService } from 'app/services/platform/content-cache.service';

@Component({
  selector: 'app-review-editor',
  template: `
    <form [formGroup]="form" (ngSubmit)="submitPost()">
      <div class="flex flex-col gap-4">
        <app-input size="base" class="w-full" label="Título" identifier="post-editor-title"
        placeholder="Sherlock Holmes e o Mistério da Biblioteca"
        formControlName="title" />
        <div class="flex gap-4 justify-between flex-wrap">
          <div class="flex gap-2 min-w-0">
            <button app-button appCombobox size="base" type="button" variant="combobox" class="font-light rounded-lg min-w-0"
            [options]="categories()" [allowMultipleOptions]="true"
            label="categorias"
            (updatedLabel)="categoryLabel = $event"
            (activeOptions)="updateFormCategories($event)"
            >
              <span class="max-w-[200px] w-fit whitespace-nowrap overflow-ellipsis overflow-hidden"> {{ categoryLabel }} </span>
            </button>
            <button app-button appCombobox size="base" type="button" variant="combobox" class="font-light rounded-lg min-w-0"
            [options]="books()" [allowMultipleOptions]="false"
            label="livros"
            (updatedLabel)="bookLabel = $event"
            (activeOptions)="updateFormBook($event)"
            >
              <span class="max-w-[200px] w-fit whitespace-nowrap overflow-ellipsis overflow-hidden"> {{ bookLabel }} </span>
            </button>
            @if(mode() === 'create') {
              <button app-button size="base" variant="contained" aria-label="Configurar livros e categorias" type="button"
              (click)="openLibraryManagerModal()">
                <i class="fi fi-sr-settings flex"></i>
              </button>
            }
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <app-rate class="xs:gap-2 gap-1 xs:text-2xl text-xl text-primary"
          [canVote]="true" [maxStars]="5" [rating]="form.get('rating')?.value || 0"
          (ratingChange)="updateFormRating($event)"
          />
          <input class="w-10 text-center outline-none placeholder:text-muted-fg border-b-2 border-b-border
          focus:border-b-primary transition-colors"
          type="text"
          placeholder="(0-5)"
          formControlName="rating"
          mask="separator.1"
          />
        </div>

        </div>
      </div>
      <quill-editor
        class="w-full h-[400px] my-4 rounded"
        [theme]="'snow'"
        formControlName="content"
        [modules]="editorModules"
        placeholder="Escreva sua review aqui...">
      </quill-editor>
      <div class="flex justify-end mt-4 gap-2">
        <button app-button size="base" class="font-medium" variant="text" type="button"
        (click)="onPreview()">Pré Visualizar</button>
        <button app-button size="base" type="submit" [disabled]="this.form.invalid">{{ mode() === 'create' ? 'Publicar' : 'Editar' }}</button>
      </div>
    </form>
  `,
  styleUrls: ['./review-editor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, QuillModule, ButtonComponent, InputComponent, ComboboxDirective,
   RateComponent, NgxMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewEditorComponent {
  private fb = inject(FormBuilder);
  private reviews = inject(ReviewsService);
  private modalService = inject(ModalService);
  private router = inject(Router);
  private contentCache = inject(ContentCacheService);
  // 
  mode = input<'create' | 'edit'>('create');
  review = input<Review | null>(null);
  
  form: FormGroup<ReviewForm> = this.fb.group({
    title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    content: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    categories: this.fb.control<string[]>([], { nonNullable: true, validators: [Validators.required] }),
    rating: this.fb.control<number | null>(3.5, { validators: [Validators.min(0), Validators.max(5)] }),
    book: this.fb.control<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
  });
  isInitialFetchCompleted = false;
  categories = signal<ComboboxOption[]>([]);
  books = signal<ComboboxOption[]>([]);
  categoryLabel = '';
  bookLabel = '';

  editorModules = EDITOR_MODULES; // imported from quill-config.ts

  private syncBooksAndCategories = effect(() => {
    this.fetchBooksAndCategories();
  });

  private populateFormOnEdit = effect(() => {
    if (this.mode() === 'edit' && this.review()) {
      const reviewData = this.review()!;
      this.form.patchValue({
        title: reviewData.title,
        content: reviewData.content,
        rating: reviewData.rating,
        book: reviewData.book.id,
        categories: reviewData.categories.map(c => c.id)
      });
    }
    untracked(() => { 
      const bookAndCategories = this.reviews.$booksAndCategories();
      if (bookAndCategories) {
        this.populateBooksAndCategories(this.reviews.$booksAndCategories()!) // populate combobox options
      } 
    })
  });

  onPreview() {
    if (this.form.invalid) {
      return;
    }
    // const { title, content, categories } = this.form.value;
    // const post: PostPreview = { title: title as string, content: content as string, categories: [] };
    // this.preview.emit(post);
  }

  private fetchBooksAndCategories() {
    const data = this.reviews.$booksAndCategories();
    if (data) {
      this.populateBooksAndCategories(data);
    } else {
      this.reviews.updateBooksAndCategories();
    }
    
    if(this.mode() === 'create')
    this.form.patchValue({ book: null, categories: [] }); // reset selections
  }

  private populateBooksAndCategories(data: BooksAndCategories) {
    this.categories.set(data.categories.map(category => ({
      value: category.id,
      label: category.name,
      active: this.form.get('categories')?.value.includes(category.id)
    })));
    this.books.set(data.books.map(book => ({
      value: book.id.toString(),
      label: `${book.title} - ${book.author}`,
      active: this.form.get('book')?.value === book.id
    })));
  }
    

  protected updateFormCategories(categories: ComboboxOption[]) {
    const categoryIds = categories.map(category => category.value);
    this.form.patchValue({ categories: categoryIds });
  }

  protected updateFormBook(book: ComboboxOption[]) {
    this.form.patchValue({ book: parseInt(book[0].value, 10) }); // convert string to number
  }

  protected updateFormRating(rating: number) {
    this.form.patchValue({ rating });
  }

  protected submitPost() {
    if (this.form.invalid) {
      return;
    }

    const { title, content, categories, rating, book } = this.form.value;

    this.form.disable(); // prevent multiple submissions

    if (this.mode() === 'create') {
      const reviewData: CreateReviewDTO = {
        title: title!,
        content: content!,
        rating: rating!,
        book_id: book!,
        category_ids: categories!,
      };
      this.createReview(reviewData);
    } else if (this.mode() === 'edit' && this.review()) {
      const reviewData: UpdateReviewDTO = {
        id: this.review()!.id,
        title: title!,
        content: content!,
        rating: rating!,
        book_id: book!,
        category_ids: categories!,
      };
      this.updateReview(reviewData);
    }
  }

  private createReview(reviewData: CreateReviewDTO) {
    this.reviews.createReview(reviewData).then((data) => {
      this.form.reset();
      this.form.enable();
      this.contentCache.clear();
      this.router.navigate(['/resenha', data.slug]);
    }).catch(() => {
      this.form.enable(); // re-enable form on error
    });
  }

  private updateReview(reviewData: UpdateReviewDTO) {
    this.reviews.updateReview(reviewData).then((data) => {
      this.form.enable();
      this.contentCache.clear();
      this.router.navigate(['/resenha', data.slug]);
    }).catch(() => {
      this.form.enable(); // re-enable form on error
    });
  }

  protected openLibraryManagerModal() {
    this.modalService.open(LibraryManagerComponent,
      { role: 'dialog' }
    )
  }
}
