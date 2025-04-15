import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { SignupService } from './signup.service';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ErrorComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private signupService = inject(SignupService)

  signupForm = new FormGroup({
    username: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] }),
    confirm_password: new FormControl('', { validators: [Validators.required] }),
  })

  signupError = computed(() => this.signupService.signUpResponse())

  isError = !this.signupError().success && this.signupError().message !== ''

  onSubmit() {
    const values = this.signupForm.value
    const username = values.username;
    const password = values.password;
    const confirm_password = values.confirm_password;
    if (password !== confirm_password) {
      return;
    }

    const request = {
      username: username || "",
      password: password || ""
    }

    if (this.signupForm.valid) {
      this.signupService.onSignup(request);
    }
  }
}
