import { TestBed } from '@angular/core/testing';

import { IndexedDBManagerService } from './indexed-dbmanager.service';

describe('IndexedDBManagerService', () => {
  let service: IndexedDBManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDBManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
