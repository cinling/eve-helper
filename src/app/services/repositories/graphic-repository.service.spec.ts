import { TestBed } from '@angular/core/testing';

import { GraphicRepositoryService } from './graphic-repository.service';
import { provideHttpClient } from '@angular/common/http';
import { withInterceptorsFromDi } from '@angular/common/http';

describe('GraphicRepositoryService', () => {
  let service: GraphicRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    service = TestBed.inject(GraphicRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
