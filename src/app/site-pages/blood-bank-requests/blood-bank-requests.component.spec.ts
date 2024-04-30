import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankRequestsComponent } from './blood-bank-requests.component';

describe('BloodBankRequestsComponent', () => {
  let component: BloodBankRequestsComponent;
  let fixture: ComponentFixture<BloodBankRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BloodBankRequestsComponent]
    });
    fixture = TestBed.createComponent(BloodBankRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
