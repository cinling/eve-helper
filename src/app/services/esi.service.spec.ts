import { TestBed } from '@angular/core/testing';

import { EsiService } from './esi.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EsiService', () => {
  let service: EsiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(EsiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
