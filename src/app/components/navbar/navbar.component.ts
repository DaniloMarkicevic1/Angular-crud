import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppService } from '../../app.service';
import { LogoutService } from '@/app/auth/logout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private appService = inject(AppService)
  private logoutService = inject(LogoutService)

  isLoggedIn = computed(() => this.appService.isLoggedIn())

  onLogout() { this.logoutService.onLogout() }
}
