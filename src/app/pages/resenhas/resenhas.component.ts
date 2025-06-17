import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserPostsService } from 'app/services/posts/user-posts.service';
import { ComboboxOption } from "../../components/shared/combobox/combobox.component";
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { createAnimation } from 'app/angular-animations/animations.utils';
import { ComboboxDirective } from 'app/components/shared/combobox/combobox.directive';
import { SearchbarComponent } from "../../components/shared/searchbar/searchbar.component";

@Component({
  selector: 'app-resenhas',
  imports: [ButtonComponent, ComboboxDirective, SearchbarComponent],
  templateUrl: './resenhas.component.html',
  animations: [createAnimation('popUp', { animateY: true, transform: 'scale(.95)' })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResenhasComponent {
  private userPostsService = inject(UserPostsService);
  labelCategorias = signal('');
  labelAvaliacoes = signal('');
  isComboboxOpen = signal(false);

  comboboxOptions = signal<ComboboxOption[]>([
    { label: 'Opção 1', value: 'opcao1', active: false },
    { label: 'Opção 2', value: 'opcao2', active: false },
    { label: 'Lanterna', value: 'opcao3', active: false },
  ])


  toggleComboboxOpen() {
    this.isComboboxOpen.update(state => !state);
  }

  updateOptions(activeOptions: ComboboxOption[]) {
    this.comboboxOptions.update(options => {
      return options.map(option => ({
        ...option,
        active: activeOptions.some(activeOption => activeOption.value === option.value)
      }));
    })
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
