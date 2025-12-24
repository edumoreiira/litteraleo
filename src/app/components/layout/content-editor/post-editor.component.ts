import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonComponent } from "app/components/base/Button/button.component";
import { InputComponent } from "app/components/base/input/input.component";
import { EDITOR_MODULES } from "app/config/quill-config";
import { PostForm } from "app/models/post.interface";
import { ContentCacheService } from "app/services/platform/content-cache.service";
import { PostService } from "app/services/posts/post.service";
import { QuillModule } from "ngx-quill";

@Component({
  selector: 'app-post-editor',
  template: `
    <form [formGroup]="form" (ngSubmit)="submitPost()">
      <app-input size="base" class="w-full" label="Título" identifier="post-editor-title"
      placeholder="Meu texto incrível"
      formControlName="title" />
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
        <button app-button size="base" type="submit" [disabled]="this.form.invalid">Publicar</button>
      </div>
    </form>
  `,
  styleUrls: ['./review-editor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, QuillModule, ButtonComponent, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditorComponent {
  private fb = inject(FormBuilder);
  private post = inject(PostService);
  private router = inject(Router);
  private contentCache = inject(ContentCacheService);

  form: FormGroup<PostForm> = this.fb.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]]
  })

  editorModules = EDITOR_MODULES; // imported from quill-config.ts

  submitPost() {
    if (this.form.valid) {
      const postFormValues = this.form.value as { title: string; content: string };
      this.post.createPost(postFormValues).then(({data, error}) => {
        if (data) {
          this.form.reset();
          this.contentCache.clear();
          this.router.navigate(['/post', data.slug]);
        }
      })
    }
  }

  onPreview() {

  }

  
}