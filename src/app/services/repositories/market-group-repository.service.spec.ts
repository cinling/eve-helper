import { TestBed } from '@angular/core/testing';

import { MarketGroupRepositoryService } from './market-group-repository.service';
import { provideHttpClient } from '@angular/common/http';
import { withInterceptorsFromDi } from '@angular/common/http';

describe('MarketGroupRepositoryService', () => {
  let service: MarketGroupRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(MarketGroupRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
