import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBloodBankDetailsComponent } from './request-blood-bank-details.component';

describe('RequestBloodBankDetailsComponent', () => {
  let component: RequestBloodBankDetailsComponent;
  let fixture: ComponentFixture<RequestBloodBankDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestBloodBankDetailsComponent]
    });
    fixture = TestBed.createComponent(RequestBloodBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
