import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, effect, inject, input } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonComponent } from "app/components/base/Button/button.component";
import { InputComponent } from "app/components/base/input/input.component";
import { EDITOR_MODULES } from "app/config/quill-config";
import { Post, PostForm, UpdatePostDTO } from "app/models/post.interface";
import { ContentCacheService } from "app/services/platform/content-cache.service";
import { PostService } from "app/services/posts/post.service";
import { QuillModule } from "ngx-quill";

@Component({
  selector: 'app-post-editor',
  template: `
    <form [formGroup]="form" (ngSubmit)="submitPost()">
      <div class="flex flex-col gap-4">
        <app-input size="base" class="w-full" label="Título" identifier="post-editor-title"
        placeholder="Meu texto incrível"
        formControlName="title" />
        <app-input size="base" label="Descrição" identifier="post-editor-description" type="textarea" [rows]="2"
        formControlName="description" placeholder="Escreva uma breve descrição do seu texto..."
        />
      </div>
      <quill-editor
        class="w-full h-[400px] my-4 rounded"
        [theme]="'snow'"
        formControlName="content"
        [modules]="editorModules"
        placeholder="Escreva seu texto aqui...">
      </quill-editor>
      <div class="flex justify-end mt-4 gap-2">
        <button app-button size="base" class="font-medium" variant="text" type="button"
        (click)="onPreview()">Pré Visualizar</button>
        <button app-button size="base" type="submit" [disabled]="this.form.invalid">{{ mode() === 'create' ? 'Publicar' : 'Editar' }}</button>
      </div>
    </form>
  `,
  styleUrls: ['./review-editor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, QuillModule, ButtonComponent, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditorComponent {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private router = inject(Router);
  private contentCache = inject(ContentCacheService);
  // 
  mode = input<'create' | 'edit'>('create');
  post = input<Post | null>(null);

  form: FormGroup<PostForm> = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    content: ['', [Validators.required]],
  })

  editorModules = EDITOR_MODULES; // imported from quill-config.ts

  constructor(){
    effect(() => {
      if (this.mode() === 'edit' && this.post()) {
        this.form.controls.title.setValue(this.post()!.title);
        this.form.controls.content.setValue(this.post()!.content);
        this.form.controls.description.setValue(this.post()!.description || '');
      }
    })
  }

  protected submitPost() {
    if (this.form.valid) {
      const postFormValues = this.form.value as { title: string; content: string };
      this.form.disable(); // prevent multiple submissions
      if(this.mode() === 'create') {
        this.createPost(postFormValues);
      } else if(this.mode() === 'edit' && this.post()) {
        const updateValues: UpdatePostDTO = {
          id: this.post()!.id,
          ...postFormValues
        }
        this.updatePost(updateValues);
      }
    }
  }

  private createPost(postValues: { title: string; content: string }) {
    this.postService.createPost(postValues).then(({data, error}) => {
      if (data) {
        this.contentCache.clear();
        this.router.navigate(['/post', data.slug]);
      }
      if (error) {
        this.form.enable(); // re-enable form on error
      }
    })
  }

  private updatePost(postValues: UpdatePostDTO) {
    this.postService.updatePost(postValues).then(({data, error}) => {
      if (data) {
        this.contentCache.clear();
        this.router.navigate(['/post', data.slug]);
      }
      if (error) {
        this.form.enable(); // re-enable form on error
      }

    })
  }

  onPreview() {
    
  }

  
}