import { TestBed } from '@angular/core/testing';

import { EncryptService } from '../Security-Services/encrypt.Service';

describe('EncryptService', () => {
  let service: EncryptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
