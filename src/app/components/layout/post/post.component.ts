import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { SafeHtmlPipe } from 'app/pipes/safe-html-pipe';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-post',
  template: `
    <h1 class="text-2xl">{{ title() }}</h1>
<div class="ql-snow">
  <div class="ql-editor no-padding" [innerHTML]="content() | safeHtml"></div>
</div>
  `,
  styles: `
  .no-padding { padding: 0 !important; }
  `,
  imports: [QuillModule, CommonModule, SafeHtmlPipe]
})
export class PostComponent {
  readonly title = input('Título do Post');
  readonly content = input('Conteúdo do Post');
}
