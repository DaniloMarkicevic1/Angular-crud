import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SignupRequest, SignupResponse } from './signup.types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private http = inject(HttpClient)
  private router = inject(Router);
  private signupUrl = environment.apiUrl + '/signup'

  signUpResponse = signal<SignupResponse>({ success: false, message: '' })

  async onSignup(request: SignupRequest) {
    return this.http.post<SignupResponse>(this.signupUrl, request).subscribe({
      next: (value) => {
        this.signUpResponse.set(value);
      },
      error: (err) => {
        console.log('Signup Error:', err);
        this.signUpResponse.set(err.message);
      },
    })
  }
}
