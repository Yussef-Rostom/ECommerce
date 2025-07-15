import { TestBed } from '@angular/core/testing';

import { RequestProductsService } from './request-products.service';

describe('RequestProductsService', () => {
  let service: RequestProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
