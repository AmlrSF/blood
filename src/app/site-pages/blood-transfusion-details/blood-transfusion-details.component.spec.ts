import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodTransfusionDetailsComponent } from './blood-transfusion-details.component';

describe('BloodTransfusionDetailsComponent', () => {
  let component: BloodTransfusionDetailsComponent;
  let fixture: ComponentFixture<BloodTransfusionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BloodTransfusionDetailsComponent]
    });
    fixture = TestBed.createComponent(BloodTransfusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
