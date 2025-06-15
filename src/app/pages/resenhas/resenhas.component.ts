import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { ComboboxComponent, ComboboxOption } from "../../components/shared/combobox/combobox.component";
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';

@Component({
  selector: 'app-resenhas',
  imports: [ComboboxComponent, ButtonComponent, ComboboxDirective],
  templateUrl: './resenhas.component.html',
  animations: [createAnimation('popUp', { animateY: true, transform: 'scale(.95)' })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResenhasComponent {
  private userPostsService = inject(UserPostsService);
  label = signal('');
  isComboboxOpen = signal(false);

  comboboxOptions = signal<ComboboxOption[]>([
    { label: 'Opção 1', value: 'opcao1', active: true },
    { label: 'Opção 2', value: 'opcao2', active: false },
    { label: 'Lanterna', value: 'opcao3', active: false },
  ])


  toggleComboboxOpen() {
    this.isComboboxOpen.update(state => !state);
  }

  x(a:any) {
    console.log(a);
    
  }

  embaralhar() {
    this.comboboxOptions.set(
      [
        { label: 'Opcao 43', value: 'opcao43', active: true },
        { label: 'Opcao 44', value: 'opcao44', active: false }
      ]
    )
  }
}
