import { TestBed } from '@angular/core/testing';

import { ScrollServiceService } from './scroll-service.service';

describe('ScrollServiceService', () => {
  let service: ScrollServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
