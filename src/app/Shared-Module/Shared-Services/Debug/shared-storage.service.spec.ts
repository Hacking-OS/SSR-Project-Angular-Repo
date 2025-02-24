import { TestBed } from '@angular/core/testing';

import { StorageManagerService } from '../shared-storage.service';

describe('StorageManagerService', () => {
  let service: StorageManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
