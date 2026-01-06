import { TestBed } from '@angular/core/testing';

import { ConversionHistoryService } from './conversion-history.service';

describe('ConversionHistoryService', () => {
  let service: ConversionHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversionHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
