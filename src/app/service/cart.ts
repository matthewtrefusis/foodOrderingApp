import { Injectable, computed, signal } from '@angular/core';
import { MenuItem } from '../model/menuItem.type';

export type CartItem = MenuItem & { quantity: number };

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly items = signal<Array<CartItem>>([]);

  readonly cartItems = computed(() => this.items());
  readonly totalItems = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  addToCart(item: MenuItem, quantity: number): void {
    const existingItem = this.items().find(
      (cartItem) => (cartItem._id || cartItem.id) === (item._id || item.id),
    );

    if (existingItem) {
      this.items.update((items) =>
        items.map((cartItem) =>
          (cartItem._id || cartItem.id) === (item._id || item.id)
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        ),
      );
    } else {
      this.items.update((items) => [...items, { ...item, quantity }]);
    }
  }

  removeFromCart(itemId: string): void {
    this.items.update((items) => items.filter((item) => (item._id || item.id) !== itemId));
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    this.items.update((items) =>
      items.map((item) => ((item._id || item.id) === itemId ? { ...item, quantity } : item)),
    );
  }

  clearCart(): void {
    this.items.set([]);
  }
}
