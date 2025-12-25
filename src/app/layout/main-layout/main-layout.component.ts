import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../components/layout/navbar.component";
import { FooterComponent } from 'app/components/layout/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  host: {
    class: 'flex flex-col flex-grow'
  },
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {

}
