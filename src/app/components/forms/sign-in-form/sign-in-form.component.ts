import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputComponent } from "../../base/input/input.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../base/Button/button.component';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastService } from 'app/services/ui/toast.service';
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
  // 
  loginForm!: FormGroup<SignInForm>;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: this.fb.control('', { nonNullable: true, validators: [Validators.email, Validators.required] }),
      password: this.fb.control('', { nonNullable: true, validators: [Validators.required]})
    })
  }

  onLoginSubmit() {
    if(this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.auth.signInWithEmail(email!, password!).then(res => {
      if (res.error) {
        const msg = res.error.code === 'invalid_credentials' ? 'Email ou senha inválidos' : res.error.message;
        this.toast.create({ variant: 'error', message: msg || 'Erro ao tentar realizar login' });
      }
      if (res.data.session) {
        this.toast.create({ variant: 'success', message: 'Login realizado com sucesso!' });
      }
    })
  }
}
