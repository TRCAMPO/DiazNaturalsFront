import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePaymentUserComponent } from './validate-payment-user.component';

describe('ValidatePaymentUserComponent', () => {
  let component: ValidatePaymentUserComponent;
  let fixture: ComponentFixture<ValidatePaymentUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidatePaymentUserComponent]
    });
    fixture = TestBed.createComponent(ValidatePaymentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
