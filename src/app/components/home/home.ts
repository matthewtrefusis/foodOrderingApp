import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { MenuItem } from '../../model/menuItem.type';
import { MenuItemsService } from '../../service/menu-items';
import { SearchService } from '../../service/search';
import { FilterMenuPipe } from '../../pipes/filter-menu.pipe';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CurrencyPipe, FilterMenuPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly menuItemsService = inject(MenuItemsService);
  private readonly router = inject(Router);
  readonly searchService = inject(SearchService);
  readonly hasLoadError = signal(false);
  readonly loadErrorMessage = signal('Unable to load menu items.');

  readonly menuItems$ = this.menuItemsService.getMenuItemsFromApi().pipe(
    catchError((error: unknown) => {
      this.hasLoadError.set(true);
      this.loadErrorMessage.set(this.getLoadErrorMessage(error));
      return of([]);
    }),
  );

  private getLoadErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'object' && error.error && 'message' in error.error) {
        const message = String((error.error as { message: unknown }).message);
        return message;
      }

      if (error.status === 0) {
        return 'Cannot reach API server at localhost:8080. Start the backend and check CORS settings.';
      }

      return `Request failed (${error.status}): ${error.statusText || 'Unknown error'}`;
    }

    return 'Unable to load menu items.';
  }

  navigateToItem(item: MenuItem): void {
    const id = item._id || item.id;
    if (id) {
      this.router.navigate(['/menu', id]);
    }
  }
}
