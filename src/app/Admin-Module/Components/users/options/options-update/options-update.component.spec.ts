import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsUpdateComponent } from './options-update.component';

describe('OptionsUpdateComponent', () => {
  let component: OptionsUpdateComponent;
  let fixture: ComponentFixture<OptionsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionsUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
