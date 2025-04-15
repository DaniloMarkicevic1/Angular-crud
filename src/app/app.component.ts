import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { AppService } from './app.service';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private appService = inject(AppService);
  title = 'MyProject';

  ngOnInit(): void {
    const token = localStorage.getItem(environment.authCookieName)
    if (token) {
      this.appService.isLoggedIn.set(true),
        this.appService.getLogedInUserInfo()
    };
  }

}
