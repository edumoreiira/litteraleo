import { Component, signal } from '@angular/core';
import { ReviewEditorComponent } from "../../components/layout/content-editor/review-editor.component";
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { NgClass } from '@angular/common';
import { EmButtonToggleGroupComponent } from 'app/components/base/button-toggle/em-button-toggle-group.component';
import { EmButtonToggleDirective } from 'app/components/base/button-toggle/em-button-toggle.directive';
import { EmButtonToggleAnimationDirective } from 'app/components/base/button-toggle/em-button-toggle-animation.directive';
import { FormsModule } from "@angular/forms";
import { PostEditorComponent } from 'app/components/layout/content-editor/post-editor.component';

@Component({
  selector: 'app-nova-resenha',
  templateUrl: './nova-resenha.component.html',
  imports: [ReviewEditorComponent, ButtonComponent, NgClass, EmButtonToggleGroupComponent, EmButtonToggleDirective,
    EmButtonToggleAnimationDirective, FormsModule, PostEditorComponent]
})
export class NovaResenhaComponent {
  state = signal<'edit' | 'preview'>('edit');
  title = signal('');
  content = signal('');
  contentType = signal<'review' | 'post'>('review');

  onPreviewState() {
    // this.state.set('preview');
    // this.title.set(post.title);
    // this.content.set(post.content);
  }

  setEditState() {
    this.state.set('edit');
  }
}
