import { Component, effect, inject, signal } from '@angular/core';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { ManageBookFormComponent } from 'app/components/forms/manage-book-form/manage-book-form.component';
import { ManageCategoryFormComponent } from 'app/components/forms/manage-category-form/manage-category-form.component';
import { ComboboxOption } from 'app/components/shared/combobox/combobox.component';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { HasRoleDirective } from 'app/directives/auth/has-role.directive';
import { ModalRef } from 'app/models/modal.interface';
import { Book, BooksAndCategories, ReviewCategory } from 'app/models/review.interface';
import { ReviewsService } from 'app/services/posts/reviews.service';
import { DialogService } from 'app/services/ui/dialog.service';
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
  imports: [ComboboxDirective, ButtonComponent, HasRoleDirective],
  templateUrl: './library-manager.component.html',
})
export class LibraryManagerComponent {
  private reviews = inject(ReviewsService);
  private modal = inject(ModalService);
  private dialog = inject(DialogService);
  // 
  library = signal<LibraryData>({
    books: { comboboxOptions: [], data: [], selectedId: null },
    categories: { comboboxOptions: [], data: [], selectedId: null }
  });
  bookLabel = '';
  categoryLabel = '';

  private syncLibraryData = effect(() => {
    this.loadLibraryData();
    console.log('Library data synced');
  })


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

  protected onDeleteBook() {
    const bookTitle = this.library().books.data.find(book => book.id === this.library().books.selectedId)?.title ?? 'unknown';
    this.dialog.openConfirmationDialog(
      {
        title: 'Confirmar exclusão',
        message: `Tem certeza que deseja excluir o livro ${bookTitle}? Esta ação não pode ser desfeita.`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        variant: 'destructive'
      },
      {
        onConfirm: () => { this.deleteBook(); },
      }
    );
  }

  private deleteBook() {
    if (!this.library().books.selectedId) return;
    this.reviews.deleteBook(this.library().books.selectedId!).then(() => {
      this.reviews.updateBooksAndCategories();
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

  private loadLibraryData(){
    const data = this.reviews.$booksAndCategories();
    if (data) {
      this.populateLibrary(data);
    } else {
      this.reviews.updateBooksAndCategories();
    }
  }

  private populateLibrary(data: BooksAndCategories) {
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

  
  protected createCategoryDialog() {
    const modalRef = this.modal.open(ManageCategoryFormComponent, { role: 'dialog', componentInputs: { mode: 'create' } });
    this.updateLibraryAndCloseModal(modalRef);
  }
  
  protected updateCategoryDialog() {
    if (!this.library().categories.selectedId) return;
    const selectedCategory = this.library().categories.data.find(category => category.id === this.library().categories.selectedId);
    if (!selectedCategory) return;
    const modalRef = this.modal.open(ManageCategoryFormComponent, 
      { 
        role: 'dialog', 
        componentInputs: { 
          mode: 'edit',
          category: selectedCategory
        } 
      }
    )
    this.updateLibraryAndCloseModal(modalRef);
  }

  protected onDeleteCategory() {
    const categoryName = this.library().categories.data.find(cat => cat.id === this.library().categories.selectedId)?.name ?? 'unknown';
    this.dialog.openConfirmationDialog(
      {
        title: 'Confirmar exclusão',
        message: `Tem certeza que deseja excluir a categoria ${categoryName}? Esta ação não pode ser desfeita.`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        variant: 'destructive'
      },
      {
        onConfirm: () => { this.deleteCategory(); },
      }
    );
  }
  private deleteCategory() {
    if (!this.library().categories.selectedId) return;
    this.reviews.deleteCategory(this.library().categories.selectedId!).then(() => {
      this.reviews.updateBooksAndCategories();
    });
  }

  private updateLibraryAndCloseModal(modalRef: ModalRef<ManageBookFormComponent | ManageCategoryFormComponent>) {
    if( modalRef.componentRef.instance instanceof ManageCategoryFormComponent ) {
      modalRef.componentRef.instance.onCategoryManage.subscribe(() => {
        this.reviews.updateBooksAndCategories();
        modalRef.close();
      });
    } else if( modalRef.componentRef.instance instanceof ManageBookFormComponent ) {
      modalRef.componentRef.instance.onBookManage.subscribe(() => {
        this.reviews.updateBooksAndCategories();
        modalRef.close();
      });
    }
  }
  
} 