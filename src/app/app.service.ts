import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private http = inject(HttpClient);
  isLoggedIn = signal(false);
  token = signal(localStorage.getItem(environment.authCookieName));
  loggedInUserId = signal(0);

  getUserUrl = environment.apiUrl + '/user';

  getLogedInUserInfo(token?: string) {
    this.http
      .post<{ user: { id: number; username: string } }>(this.getUserUrl, {
        token: token || this.token(),
      })
      .subscribe({
        next: (value) => {
          this.loggedInUserId.set(value.user.id);
        },
      });
  }
}
