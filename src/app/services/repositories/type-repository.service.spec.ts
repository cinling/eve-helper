import { TestBed } from '@angular/core/testing';

import { TypeRepositoryService } from './type-repository.service';
import { provideHttpClient } from '@angular/common/http';
import { withInterceptorsFromDi } from '@angular/common/http';

describe('TypeRepositoryService', () => {
  let service: TypeRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(TypeRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
