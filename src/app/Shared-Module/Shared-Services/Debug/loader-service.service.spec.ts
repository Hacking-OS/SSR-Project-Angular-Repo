import { TestBed } from '@angular/core/testing';

import { PageLoaderService } from '../Loader-Services/page-loader-control.service';

describe('LoaderServiceService', () => {
  let service: PageLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
