import { TestBed } from '@angular/core/testing';

import { CommonMessageService } from './common-message.service';

describe('CommonMessageService', () => {
  let service: CommonMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
