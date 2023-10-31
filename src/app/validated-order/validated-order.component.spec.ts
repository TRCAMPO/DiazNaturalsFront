import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedOrderComponent } from './validated-order.component';

describe('ValidatedOrderComponent', () => {
  let component: ValidatedOrderComponent;
  let fixture: ComponentFixture<ValidatedOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidatedOrderComponent]
    });
    fixture = TestBed.createComponent(ValidatedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
