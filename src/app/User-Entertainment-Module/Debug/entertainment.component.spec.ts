import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentComponent } from '../Components/entertainment/entertainment.component';

describe('EntertainmentComponent', () => {
  let component: EntertainmentComponent;
  let fixture: ComponentFixture<EntertainmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntertainmentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EntertainmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
