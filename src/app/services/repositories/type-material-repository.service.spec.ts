import { TestBed } from '@angular/core/testing';

import { TypeMaterialRepositoryService } from './type-material-repository.service';
import { provideHttpClient } from '@angular/common/http';
import { withInterceptorsFromDi } from '@angular/common/http';

describe('TypeMaterialRepositoryService', () => {
  let service: TypeMaterialRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(TypeMaterialRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
