import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponentDeleteProduct } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponentDeleteProduct;
  let fixture: ComponentFixture<ConfirmDialogComponentDeleteProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponentDeleteProduct]
    });
    fixture = TestBed.createComponent(ConfirmDialogComponentDeleteProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
