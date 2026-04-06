import { TestBed } from '@angular/core/testing';

import { MenuItemsService } from './menu-items';

describe('MenuItems', () => {
  let service: MenuItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
