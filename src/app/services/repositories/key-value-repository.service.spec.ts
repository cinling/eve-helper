import { TestBed } from '@angular/core/testing';

import { KeyValueRepositoryService } from './key-value-repository.service';

describe('KeyValueRepositoryService', () => {
  let service: KeyValueRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyValueRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
