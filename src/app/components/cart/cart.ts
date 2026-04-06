import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../service/cart';

@Component({
  selector: 'app-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly cartItems = this.cartService.cartItems;
  readonly totalPrice = this.cartService.totalPrice;

  incrementQuantity(itemId: string, currentQuantity: number): void {
    this.cartService.updateQuantity(itemId, currentQuantity + 1);
  }

  decrementQuantity(itemId: string, currentQuantity: number): void {
    this.cartService.updateQuantity(itemId, currentQuantity - 1);
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  checkout(): void {
    if (this.cartItems().length > 0) {
      alert('Checkout functionality coming soon!');
    }
  }
}
