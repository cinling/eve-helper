import { TestBed } from '@angular/core/testing';

import { EveEsiApiService } from './eve-esi-api.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EveEsiApiService', () => {
  let service: EveEsiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(EveEsiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
