import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from '../model/menuItem.type';

@Pipe({
  name: 'filterMenu',
  standalone: true,
})
export class FilterMenuPipe implements PipeTransform {
  transform(items: Array<MenuItem>, searchTerm: string): Array<MenuItem> {
    if (!searchTerm || searchTerm.trim() === '') {
      return items;
    }

    const term = searchTerm.toLowerCase().trim();

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term),
    );
  }
}
