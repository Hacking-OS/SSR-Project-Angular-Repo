import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmacAuthComponent } from '../Components/demo-crypto-hmac/demo-crypto-hmac.component';

describe('DemoCryptoHmacComponent', () => {
  let component: HmacAuthComponent;
  let fixture: ComponentFixture<HmacAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HmacAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmacAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
