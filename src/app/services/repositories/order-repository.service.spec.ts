import { TestBed } from '@angular/core/testing';

import { OrderRepositoryService } from './order-repository.service';
import { provideHttpClient } from '@angular/common/http';
import { withInterceptorsFromDi } from '@angular/common/http';

describe('OrderRepositoryService', () => {
  let service: OrderRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(OrderRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
