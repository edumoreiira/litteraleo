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

@Component({
  selector: 'app-post-editor',
  template: `
  <section class="page-container--xs pt-20">
    <form [formGroup]="form" (ngSubmit)="submitPost()">
      <div class="flex flex-col gap-2 mb-8">
        <div class="flex items-end gap-4">
          <app-input size="base" class="w-full" label="Título" identifier="post-editor-title"
          placeholder="Digite o título do seu post"
          formControlName="title" />
          <button app-button appCombobox size="base" type="button" variant="combobox" class="font-medium rounded-lg"
          [options]="categories()" [allowMultipleOptions]="true"
          label="categorias"
          (updatedLabel)="categoryLabel = $event"
          (activeOptions)="updateFormCategories($event)"
          >
            <span class="block max-w-[200px] whitespace-nowrap overflow-ellipsis overflow-hidden"> {{ categoryLabel }} </span>
          </button>
        </div>
      </div>
      <quill-editor
        class="w-full h-[400px] mb-4 rounded"
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
  imports: [CommonModule, ReactiveFormsModule, QuillModule, ButtonComponent, InputComponent, ComboboxDirective],
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
    });
    this.form.valueChanges.subscribe((value) => console.log('Form value changed:', value));
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

  async submitPost() {
    if (this.form.invalid) {
      return;
    }
    const { title, content, categories } = this.form.value;
    const categoriesId = categories?.map(category => category.value) || [];

    await this.post.createPost(title!, '', content!, categoriesId ).then(({ data, error }) => {
      if (!error) this.form.reset();
    });
  }
}
