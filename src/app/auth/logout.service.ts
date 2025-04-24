import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private http = inject(HttpClient);
  private appService = inject(AppService);
  private apiUrl = environment.apiUrl + '/logout';
  private router = inject(Router);

  onLogout() {
    const token = localStorage.getItem(environment.authCookieName)
    this.http.post<string>(this.apiUrl, { token }).subscribe({

      next: () => {
        localStorage.removeItem(environment.authCookieName)
        this.appService.isLoggedIn.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
