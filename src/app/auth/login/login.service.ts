import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SignupRequest } from '../signup/signup.types';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private appService = inject(AppService);
  private apiUrl = environment.apiUrl + '/login';
  private router = inject(Router);

  error = signal('');

  onLogin(request: SignupRequest) {
    this.http.post<string>(this.apiUrl, request).subscribe({
      next: (value) => {
        localStorage.setItem(environment.authCookieName, value);
        this.error.set('');
        this.router.navigate(['/']);
        this.appService.isLoggedIn.set(true);
        this.appService.getLogedInUserInfo(value);
      },
      error: (err) => {
        this.error.set(err.error);
      },
    });
  }
}
