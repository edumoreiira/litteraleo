import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { InputComponent } from 'app/components/base/input/input.component';
import { Post } from 'app/models/post.interface';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-post-editor',
  template: `
  <section class="page-container--xs pt-20">
    <form [formGroup]="form" (ngSubmit)="submitPost()">
      <div class="flex flex-col gap-2 mb-8">
        <app-input class="w-full" label="Título" identifier="post-editor-title"
        placeholder="Digite o título do seu post"
        formControlName="title" />
      </div>
      <quill-editor
        class="w-full h-[400px] mb-4 rounded"
        [theme]="'snow'"
        formControlName="content"
        [modules]="editorModules"
        placeholder="Escreva seu post aqui...">
      </quill-editor>
      <div class="flex justify-end mt-4 gap-2">
        <button app-button size="base" class="font-medium" variant="text">Pré Visualizar</button>
        <button app-button size="base" type="submit" [disabled]="this.form.invalid">Publicar</button>
      </div>
    </form>
  </section>
  `,
  styleUrls: ['./post-editor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, QuillModule, ButtonComponent, InputComponent]
})
export class PostEditorComponent {
  form: FormGroup<Post>;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'background': [] }, { 'color': [] }],
      [{ 'align': [] }, { 'header': [1, 2, 3, false] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'], // remove formatting
    ],
    imageResize: {}
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      content: this.fb.control('', { nonNullable: true, validators: [Validators.required] })
    });
  }

  submitPost() {
    const conteudoHTML = this.form.value.content;
    console.log('Post HTML:', conteudoHTML);
    // enviar para o backend ou salvar localmente
  }
}
