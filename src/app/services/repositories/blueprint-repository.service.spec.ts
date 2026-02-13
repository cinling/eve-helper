import { TestBed } from '@angular/core/testing';

import { BlueprintRepositoryService } from './blueprint-repository.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BlueprintRepositoryService', () => {
  let service: BlueprintRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(BlueprintRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
