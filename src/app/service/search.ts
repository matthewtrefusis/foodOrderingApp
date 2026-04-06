import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  readonly searchTerm = signal('');

  setSearchTerm(term: string): void {
    this.searchTerm.set(term.toLowerCase().trim());
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }
}
