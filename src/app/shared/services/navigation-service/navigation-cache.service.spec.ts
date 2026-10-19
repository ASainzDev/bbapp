import { TestBed } from '@angular/core/testing';
import { NavigationCacheService } from './navigation-cache.service';

describe('NavigationCacheService', () => {
  let service: NavigationCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
