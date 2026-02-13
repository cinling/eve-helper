import { TestBed } from '@angular/core/testing';

import { InstanceMessageService } from './instance-message.service';

describe('InstanceMessageService', () => {
  let service: InstanceMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanceMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
