import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, switchMap, of } from 'rxjs';
import { CartService } from '../../service/cart';
import { MenuItemsService } from '../../service/menu-items';

@Component({
  selector: 'app-menu-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './menu-detail.html',
  styleUrl: './menu-detail.css',
})
export class MenuDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly menuItemsService = inject(MenuItemsService);
  private readonly cartService = inject(CartService);

  readonly quantity = signal(1);
  readonly menuItem$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      if (!id) {
        return of(null);
      }

      return this.menuItemsService.getMenuItemsFromApi().pipe(
        map((items) => items.find((item) => (item._id || item.id) === id) || null),
        catchError(() => of(null)),
      );
    }),
  );

  addToCart(): void {
    this.menuItem$
      .pipe(
        map((item) => {
          if (item) {
            this.cartService.addToCart(item, this.quantity());
            this.router.navigate(['/']);
          }
        }),
      )
      .subscribe();
  }

  incrementQuantity(): void {
    this.quantity.update((q) => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update((q) => (q > 1 ? q - 1 : 1));
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
