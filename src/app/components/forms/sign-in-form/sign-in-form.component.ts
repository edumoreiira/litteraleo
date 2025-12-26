import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputComponent } from "../../base/input/input.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../base/Button/button.component';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastService } from 'app/services/ui/toast.service';
import { ModalComponent } from 'app/components/dialogs/base/modal/modal.component';
interface SignInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}
@Component({
  selector: 'app-sign-in-form',
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './sign-in-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInFormComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private modal = inject(ModalComponent, { optional: true });
  // 
  loginForm!: FormGroup<SignInForm>;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: this.fb.control('', { nonNullable: true, validators: [Validators.email, Validators.required] }),
      password: this.fb.control('', { nonNullable: true, validators: [Validators.required]})
    })
  }

  async onLoginSubmit() {
    if(this.loginForm.invalid) {
      return;
    }
    this.loginForm.disable(); // prevent multiple submissions
    const { email, password } = this.loginForm.value;
    await this.auth.signInWithEmail(email!, password!).then(res => {
      if (res.error) {
        const msg = res.error.code === 'invalid_credentials' ? 'Email ou senha inválidos' : res.error.message;
        this.toast.create({ variant: 'error', message: msg || 'Erro ao tentar realizar login' });
        this.loginForm.enable();
        return;
      }
      if (res.data.session) {
        this.toast.create({ variant: 'success', message: 'Login realizado com sucesso!' });
        this.loginForm.enable();
        this.modal?.onCloseModal.emit(); // close the modal on successful login
      }
    })
  }
}
