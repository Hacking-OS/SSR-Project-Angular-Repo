import { TestBed } from '@angular/core/testing';
import { CountService } from '../services/count.Service';

describe('CountService', () => {
  let service: CountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
