import { TestBed } from '@angular/core/testing';

import { SocketService } from '../../Shared-Module/Shared-Services/Socket-IO-Services/socket.io.service';

describe('SocketIoService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
