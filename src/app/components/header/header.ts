import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../service/cart';
import { SearchService } from '../../service/search';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly cartService = inject(CartService);
  readonly searchService = inject(SearchService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly $any = (value: unknown) => value as any;

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  logout(): void {
    this.authService.logout();
  }
}
