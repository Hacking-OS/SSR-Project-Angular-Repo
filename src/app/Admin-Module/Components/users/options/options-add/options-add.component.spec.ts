import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsAddComponent } from './options-add.component';

describe('OptionsAddComponent', () => {
  let component: OptionsAddComponent;
  let fixture: ComponentFixture<OptionsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
