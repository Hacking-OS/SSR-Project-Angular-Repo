import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoNgPrimeComponent } from '../Components/demo-ng-prime/demo-ng-prime.component';

describe('DemoNgPrimeComponent', () => {
  let component: DemoNgPrimeComponent;
  let fixture: ComponentFixture<DemoNgPrimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoNgPrimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoNgPrimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
