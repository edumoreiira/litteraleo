import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { InputComponent } from 'app/components/base/input/input.component';
import { ComboboxOption } from 'app/components/shared/combobox/combobox.component';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { Post, PostForm, PostPreview } from 'app/models/post.interface';
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { QuillModule } from 'ngx-quill';
import { RateComponent } from "../../shared/rate/rate.component";
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-post-editor',
  template: `
  <section class="page-container--xs pt-20">
    <form [formGroup]="form" (ngSubmit)="submitPost()">
      <div class="flex flex-col gap-4">
        <div class="flex sm:flex-row flex-col items-end gap-4">
          <app-input size="base" class="w-full" label="Título" identifier="post-editor-title"
          placeholder="Título do seu post"
          formControlName="title" />
          <app-input size="base" class="w-full" label="Autor" identifier="post-editor-book-author"
          placeholder="Nome do autor do livro"
          formControlName="book_author"
          />
        </div>
        <div class="flex gap-4 justify-between">
          <div class="flex items-center gap-2">
            <app-rate class="xs:gap-2 gap-1 xs:text-2xl text-xl text-primary"
            [canVote]="true" [maxStars]="5" [rating]="form.get('rate')?.value || 0"
            (ratingChange)="updateFormRate($event)"
            />
            <input class="w-10 text-center outline-none placeholder:text-muted-fg border-b-2 border-b-border
            focus:border-b-primary transition-colors"
            type="text"
            placeholder="(0-5)"
            formControlName="rate"
            mask="separator.1"
            />
          </div>
          <button app-button appCombobox size="base" type="button" variant="combobox" class="font-medium rounded-lg min-w-0"
          [options]="categories()" [allowMultipleOptions]="true"
          label="categorias"
          (updatedLabel)="categoryLabel = $event"
          (activeOptions)="updateFormCategories($event)"
          >
            <span class="max-w-[200px] w-fit whitespace-nowrap overflow-ellipsis overflow-hidden"> {{ categoryLabel }} </span>
          </button>
        </div>
      </div>
      <quill-editor
        class="w-full h-[400px] my-4 rounded"
        [theme]="'snow'"
        formControlName="content"
        [modules]="editorModules"
        placeholder="Escreva seu post aqui...">
      </quill-editor>
      <div class="flex justify-end mt-4 gap-2">
        <button app-button size="base" class="font-medium" variant="text" type="button"
        (click)="onPreview()">Pré Visualizar</button>
        <button app-button size="base" type="submit" [disabled]="this.form.invalid">Publicar</button>
      </div>
    </form>
  </section>
  `,
  styleUrls: ['./post-editor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, QuillModule, ButtonComponent, InputComponent, ComboboxDirective,
   RateComponent, NgxMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditorComponent implements OnInit {
  post = inject(UserPostsService);
  // 
  form: FormGroup<PostForm>;
  preview = output<PostPreview>();
  categories = signal<ComboboxOption[]>([]);
  categoryLabel = '';

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'background': [] }, { 'color': [] }],
      [{ 'align': [] }, { 'header': [1, 2, 3, false] }],
      ['blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'], // remove formatting
    ]
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      content: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      categories: this.fb.control<ComboboxOption[]>([], { nonNullable: true, validators: [Validators.required] }),
      book_author: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      rate: this.fb.control<number | null>(3.5, { validators: [Validators.min(0), Validators.max(5)] }),
    });
    this.form.valueChanges.subscribe(() => console.log(this.form.value, this.form));
  }

  ngOnInit(): void {
    this.getCategories();
  }

  onPreview() {
    if (this.form.invalid) {
      return;
    }
    const { title, content, categories } = this.form.value;
    const post: PostPreview = { title: title as string, content: content as string, categories: categories! };
    this.preview.emit(post);
  }

  async getCategories() {
    await this.post.getAllCategories().then(data => {
      this.categories.set(data.map(category => ({
        value: category.id,
        label: category.name,
      })));
    })
  }

  updateFormCategories(categories: ComboboxOption[]) {
    this.form.patchValue({ categories });
  }

  updateFormRate(rate: number) {
    this.form.patchValue({ rate });
  }

  async submitPost() {
    if (this.form.invalid) {
      return;
    }
    const { title, content, categories, book_author, rate } = this.form.value;
    const categoriesId = categories?.map(category => category.value) || [];

    await this.post.createPost(title!, '', content!, categoriesId, rate!, book_author! ).then(({ data, error }) => {
      if (!error) this.form.reset();
    });
  }
}
