import { TestBed } from '@angular/core/testing';

import { UniverseRepositoryService } from './universe-repository.service';

describe('UniverseRepositoryService', () => {
  let service: UniverseRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniverseRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
