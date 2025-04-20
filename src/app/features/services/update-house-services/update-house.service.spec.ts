import { TestBed } from '@angular/core/testing';

import { UpdateHouseService } from './update-house.service';

describe('UpdateHouseService', () => {
  let service: UpdateHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateHouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
