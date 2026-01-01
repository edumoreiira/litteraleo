import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputComponent } from "../../base/input/input.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../base/Button/button.component';
import { AuthService } from '../../../services/auth/auth.service';
import { matchPasswordsValidator } from 'app/validators/forms.validators';
import { ToastService } from 'app/services/ui/toast.service';
interface SignUpForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
}
@Component({
  selector: 'app-sign-up-form',
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './sign-up-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpFormComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  // 
  signUpForm!: FormGroup<SignUpForm>;

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      email: this.fb.control('', { nonNullable: true, validators: [Validators.email, Validators.required] }),
      password: this.fb.control('', { nonNullable: true, validators: [Validators.required]}),
      passwordConfirm: this.fb.control('', { nonNullable: true, validators: [Validators.required] })
    }, { validators: matchPasswordsValidator('password', 'passwordConfirm') });
  }

  async onSignUpSubmit() {
    if(this.signUpForm.invalid) {
      return;
    }
    const { name, email, password } = this.signUpForm.value;
    this.signUpForm.disable(); // prevent multiple submissions
    await this.auth.signUpWithEmail(name!, email!, password!).then(res => {
      if(res.error) {
        if (res.error.code === 'weak_password') {
          this.toast.create({ variant: 'error', title: 'Senha fraca', message: 'Utilize ao menos um caractere maiúsculo, um minúsculo e um número.' });
          this.signUpForm.enable();
          return;
        }
        this.toast.create({ variant: 'error', message: res.error.message || 'Erro ao tentar criar conta' });
        this.signUpForm.enable();
      } else if(res.data.session) {
        this.signUpForm.enable();
        this.toast.create({ variant: 'success', message: 'Cadastro realizado com sucesso!' });
      } else if(res.data.user) {
        this.signUpForm.enable();
        this.signUpForm.reset();
        this.toast.create({ variant: 'success', message: 'Cadastro realizado! Verifique seu e-mail para confirmar a conta.', duration: 8000 });
      }
      
    })
    
  }
}