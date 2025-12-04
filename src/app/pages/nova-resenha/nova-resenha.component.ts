import { Component, OnInit, signal } from '@angular/core';
import { PostEditorComponent } from "../../components/layout/post-editor/post-editor.component";
import { PostPreview } from 'app/models/post.interface';
import { PostComponent } from 'app/components/layout/post/post.component';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-nova-resenha',
  templateUrl: './nova-resenha.component.html',
  imports: [PostEditorComponent, PostComponent, ButtonComponent, NgClass]
})
export class NovaResenhaComponent {
  state = signal<'edit' | 'preview'>('edit');
  title = signal('');
  content = signal('');

  onPreviewState(post: PostPreview) {
    this.state.set('preview');
    this.title.set(post.title);
    this.content.set(post.content);
  }

  setEditState() {
    this.state.set('edit');
  }
}
