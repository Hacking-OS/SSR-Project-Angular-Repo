import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusUpdateComponent } from './status-update.component';

describe('StatusUpdateComponent', () => {
  let component: StatusUpdateComponent;
  let fixture: ComponentFixture<StatusUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
