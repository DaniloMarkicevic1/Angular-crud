import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { LoginService } from './login.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, InputComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private loginService = inject(LoginService)
  private router = inject(Router)

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')

  })

  error = computed(() => this.loginService.error())

  onSubmit() {
    const username = this.loginForm.value.username || "";
    const password = this.loginForm.value.password || "";

    this.loginService.onLogin({
      password, username
    })
  }


  ngOnInit(): void {
    const token = localStorage.getItem(environment.authCookieName)
    if (token) {
      this.router.navigate(['/'])
    }

  }
}
