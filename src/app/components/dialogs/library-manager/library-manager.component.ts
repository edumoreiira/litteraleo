import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { ManageBookFormComponent } from 'app/components/forms/manage-book-form/manage-book-form.component';
import { ComboboxOption } from 'app/components/shared/combobox/combobox.component';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { ModalRef } from 'app/models/modal.interface';
import { Book, ReviewCategory } from 'app/models/review.interface';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { ModalService } from 'app/services/ui/modal.service';

interface LibraryData {
  books: {
    comboboxOptions: ComboboxOption[];
    data: Book[];
    selectedId: string | null;
  },
  categories: {
    comboboxOptions: ComboboxOption[];
    data: ReviewCategory[];
    selectedId: string | null;
  }
}

@Component({
  selector: 'app-library-manager',
  host: {
    class: 'flex flex-col gap-4'
  },
  imports: [ComboboxDirective, ButtonComponent],
  templateUrl: './library-manager.component.html',
})
export class LibraryManagerComponent {
  private reviews = inject(ReviewsService);
  private modal = inject(ModalService);
  library = signal<LibraryData>({
    books: { comboboxOptions: [], data: [], selectedId: null },
    categories: { comboboxOptions: [], data: [], selectedId: null }
  });
  bookLabel = '';
  categoryLabel = '';

  constructor() {
    this.updateLibraryData();
  }

  protected createBookDialog() {
    const modalRef = this.modal.open(ManageBookFormComponent, { role: 'dialog', componentInputs: { mode: 'create' } });
    this.updateLibraryAndCloseModal(modalRef);
  }

  protected updateBookDialog() {
    if (!this.library().books.selectedId) return;
    const selectedBook = this.library().books.data.find(book => book.id === this.library().books.selectedId);
    if (!selectedBook) return;
    const modalRef = this.modal.open(ManageBookFormComponent, 
      { 
        role: 'dialog', 
        componentInputs: { 
          mode: 'edit',
          book: selectedBook
        } 
      }
    )
    this.updateLibraryAndCloseModal(modalRef);
  }

  protected deleteBook() {
    if (!this.library().books.selectedId) return;
    this.reviews.deleteBook(this.library().books.selectedId!).then(() => {
      this.updateLibraryData();
    });
  }

  protected onBookSelect(option: ComboboxOption[]) {
    this.library.update(library => ({
      ...library,
      books: { ...library.books, selectedId: option.length > 0 ? option[0].value : null }
    }));
  }

  protected onCategorySelect(options: ComboboxOption[]) {
    this.library.update(library => ({
      ...library,
      categories: { ...library.categories, selectedId: options.length > 0 ? options[0].value : null }
    }));
  }

  private updateLibraryData(){
    this.reviews.getAllBooksAndCategories().then(({ data, error }) => { // Populate library data
      if (data) {
        const newLibraryData: LibraryData = {
          books: {
            comboboxOptions: data.books.map(book => ({ label: book.title, value: book.id })),
            data: data.books,
            selectedId: null
          },
          categories: {
            comboboxOptions: data.categories.map(category => ({ label: category.name, value: category.id })),
            data: data.categories,
            selectedId: null
          }
        };
        this.library.set(newLibraryData);
      }
    });
  }

  private updateLibraryAndCloseModal(modalRef: ModalRef<ManageBookFormComponent>){
    modalRef.componentRef.instance.onBookManage.subscribe(() => {
      this.updateLibraryData();
      modalRef.close();
    })
  }
}
