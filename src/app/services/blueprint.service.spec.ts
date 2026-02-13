import { TestBed } from '@angular/core/testing';

import { BlueprintService } from './blueprint.service';
import { TypeRepositoryService } from './repositories/type-repository.service';
import { BlueprintRepositoryService } from './repositories/blueprint-repository.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BlueprintService', () => {
  let service: BlueprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [

      ],
      providers: [
        BlueprintRepositoryService
        , TypeRepositoryService
        , provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(BlueprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
