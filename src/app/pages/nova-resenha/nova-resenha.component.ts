import { Component, signal } from '@angular/core';
import { ReviewEditorComponent } from "../../components/layout/review-editor/review-editor.component";
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-nova-resenha',
  templateUrl: './nova-resenha.component.html',
  imports: [ReviewEditorComponent, ButtonComponent, NgClass]
})
export class NovaResenhaComponent {
  state = signal<'edit' | 'preview'>('edit');
  title = signal('');
  content = signal('');

  onPreviewState() {
    // this.state.set('preview');
    // this.title.set(post.title);
    // this.content.set(post.content);
  }

  setEditState() {
    this.state.set('edit');
  }
}
