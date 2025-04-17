import { TestBed } from '@angular/core/testing';

import { SharedFilterService } from './shared-filter.service';

describe('SharedFilterService', () => {
  let service: SharedFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
