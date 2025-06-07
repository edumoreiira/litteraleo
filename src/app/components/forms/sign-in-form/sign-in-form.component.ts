import { Component } from '@angular/core';
import { InputComponent } from "../../base/input/input.component";
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../base/Button/button.component';
export interface SignInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}
@Component({
  selector: 'app-sign-in-form',
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './sign-in-form.component.html',
  styleUrl: './sign-in-form.component.scss',
})
export class SignInFormComponent {
  loginForm!: FormGroup<SignInForm>;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: this.fb.control('', { nonNullable: true, validators: [Validators.email] }),
      password: this.fb.control('', { nonNullable: true })
    })
  }
}
