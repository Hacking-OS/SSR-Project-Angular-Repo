import { TestBed } from '@angular/core/testing';

import { UserFoundGuard } from '../../Guards/user-found.Guard';

describe('UserFoundGuard', () => {
  let guard: UserFoundGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserFoundGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
