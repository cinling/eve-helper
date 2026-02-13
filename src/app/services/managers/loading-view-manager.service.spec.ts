import { TestBed } from '@angular/core/testing';

import { LoadingViewManagerService } from './loading-view-manager.service';

describe('LoadingViewService', () => {
  let service: LoadingViewManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingViewManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
