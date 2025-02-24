import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdminSettingsComponent } from './update-admin-settings.component';

describe('UpdateAdminSettingsComponent', () => {
  let component: UpdateAdminSettingsComponent;
  let fixture: ComponentFixture<UpdateAdminSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAdminSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAdminSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
