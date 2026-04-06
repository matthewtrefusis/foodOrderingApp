import { inject, Injectable } from '@angular/core';
import { MenuItem } from '../model/menuItem.type';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuItemsService {
  private readonly http = inject(HttpClient);
  private readonly menuUrls = ['/api/menu', '/api/menuItems'];

  getMenuItemsFromApi(): Observable<Array<MenuItem>> {
    return this.getMenuItemsFromUrls(this.menuUrls);
  }

  private getMenuItemsFromUrls(urls: Array<string>): Observable<Array<MenuItem>> {
    const [currentUrl, ...remainingUrls] = urls;

    return this.http.get<unknown>(currentUrl).pipe(
      map((response) => this.extractMenuItems(response)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404 && remainingUrls.length > 0) {
          return this.getMenuItemsFromUrls(remainingUrls);
        }

        return throwError(() => error);
      }),
    );
  }

  private extractMenuItems(response: unknown): Array<MenuItem> {
    if (Array.isArray(response)) {
      return response as Array<MenuItem>;
    }

    if (response && typeof response === 'object') {
      const record = response as Record<string, unknown>;
      const candidates = ['menuItems', 'items', 'data', 'menu', 'content'];

      for (const key of candidates) {
        const value = record[key];
        if (Array.isArray(value)) {
          return value as Array<MenuItem>;
        }
      }
    }

    return [];
  }
}
