import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestListsComponent } from './request-lists.component';

describe('RequestListsComponent', () => {
  let component: RequestListsComponent;
  let fixture: ComponentFixture<RequestListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestListsComponent]
    });
    fixture = TestBed.createComponent(RequestListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
