import { Component, inject } from '@angular/core';
import { InputComponent } from "../../base/input/input.component";
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../base/Button/button.component';
import { AuthService } from '../../../services/auth/auth.service';
export interface SignInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}
@Component({
  selector: 'app-sign-up-form',
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './sign-up-form.component.html',
})
export class SignUpFormComponent {
  private auth = inject(AuthService);
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
    this.auth.signInWithEmail(email!, password!);
  }

  // signInWithGoogle() {
  //   this.auth.signInWithGoogle();
  // }
}
