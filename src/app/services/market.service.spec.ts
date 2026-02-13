import { TestBed } from '@angular/core/testing';

import { MarketService } from './market.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MarketService', () => {
  let service: MarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(MarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
