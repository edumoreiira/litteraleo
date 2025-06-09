import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputComponent } from "../../base/input/input.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../base/Button/button.component';
import { AuthService } from '../../../services/auth/auth.service';
import { matchPasswordsValidator } from 'app/validators/forms.validators';
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

  onSignUpSubmit() {
    if(this.signUpForm.invalid) {
      return;
    }
    const { name, email, password } = this.signUpForm.value;
    this.auth.signUpWithEmail(name!, email!, password!);
    
  }
}
