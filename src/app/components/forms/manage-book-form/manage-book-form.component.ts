import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { InputComponent } from 'app/components/base/input/input.component';
import { Book } from 'app/models/review.interface';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { ToastService } from 'app/services/ui/toast.service';

export interface BookFormData {
  id?: number;
  title: string;
  author: string;
  publication_year: number;
  pages: number;
}

export interface BookForm {
  id: FormControl<number | null>;
  title: FormControl<string | null>;
  author: FormControl<string | null>;
  publication_year: FormControl<number | null>;
  pages: FormControl<number | null>;
}

@Component({
  selector: 'app-manage-book-form',
  host: {
    class: 'flex flex-col gap-4'
  },
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './manage-book-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageBookFormComponent {
  private fb = inject(FormBuilder);
  private reviews = inject(ReviewsService);
  private toast = inject(ToastService);
  // 
  mode = input<'create' | 'edit'>('create');
  book = input<Book>();
  bookHoverUrl = signal<string>('');
  coverImageFile?: File;
  onBookManage = output<void>();

  bookForm: FormGroup<BookForm> = this.fb.group({
    id: [null as number | null],
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    publication_year: [null as number | null, [Validators.required, Validators.min(1)]],
    pages: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    effect(() => { // Populate form if in edit mode with provided book data
      const mode = this.mode();
      const book = this.book();

      if (mode === 'edit' && book) {
        this.bookForm.patchValue({
          id: book.id,
          title: book.title,
          author: book.author,
          publication_year: book.publication_year,
          pages: book.pages,
        });
        this.bookHoverUrl.set(book.cover_image_url);
      }
    });
  }

  protected onSubmit(): void {
    if (this.bookForm.valid) {
      if (this.mode() === 'create') {
        this.createBook();
      } else {
        this.updateBook();
      }
    }
  }

  private createBook() {
    const formData = this.bookForm.getRawValue() as BookFormData;
    formData.id = undefined;
    const imageFile = this.coverImageFile;
    if (imageFile) {
      this.bookForm.disable();
      this.reviews.createBook(formData, imageFile).then((data) => {
        if (data) {
          this.bookForm.reset();
          this.coverImageFile = undefined;
          this.bookHoverUrl.set('');
          this.onBookManage.emit();
        }
      }).finally(() => { this.bookForm.enable(); });
    }
  }

  private updateBook() {
    const formData = this.bookForm.getRawValue() as BookFormData;
    const imageFile = this.coverImageFile ?? null;
    if (formData.id) {
      this.reviews.updateBook(formData, imageFile).then((data) => {
        if (data) {
          this.bookForm.reset();
          this.coverImageFile = undefined;
          this.bookHoverUrl.set('');
          this.onBookManage.emit();
        }
      })
    }
  }

  protected onCoverImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
    if(!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/webp')) {
      this.toast.create({
        variant: 'error',
        message: 'Por favor, selecione uma imagem válida (JPEG, PNG ou WEBP).',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      this.coverImageFile = file;
      this.bookHoverUrl.set(reader.result as string);
    }
    reader.readAsDataURL(file);
  }
}
