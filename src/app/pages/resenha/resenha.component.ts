import { Component } from '@angular/core';
import { TextDirective } from 'app/directives/ui/text.directive';
import { TitleDirective } from 'app/directives/ui/title.directive';

@Component({
  selector: 'app-resenha',
  imports: [TitleDirective, TextDirective],
  templateUrl: './resenha.component.html',
  styleUrl: './resenha.component.scss'
})
export class ResenhaComponent {

}
