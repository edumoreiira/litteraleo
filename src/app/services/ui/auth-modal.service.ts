import { inject, Injectable } from "@angular/core";
import { ModalService } from "./modal.service";
import { AuthWrapperComponent } from "app/components/dialogs/auth-wrapper/auth-wrapper.component";

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private modal = inject(ModalService);
  
  openLoginModal() {
    const modalRef = this.modal.open(AuthWrapperComponent, 
      { role: 'dialog', componentInputs: {
        initialMode: 'sign-in'
      } })
    return modalRef;
  }
  openSignUpModal() {
    const modalRef = this.modal.open(AuthWrapperComponent, 
      { role: 'dialog', componentInputs: {
        initialMode: 'sign-up'
      } })
    return modalRef;
  }
}