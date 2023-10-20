import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogCreateOrderComponent } from './confirm-dialog-create-order.component';

describe('ConfirmDialogCreateOrderComponent', () => {
  let component: ConfirmDialogCreateOrderComponent;
  let fixture: ComponentFixture<ConfirmDialogCreateOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogCreateOrderComponent]
    });
    fixture = TestBed.createComponent(ConfirmDialogCreateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
