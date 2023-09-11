import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogEditSupplierComponent } from './confirm-dialog-edit-supplier.component';

describe('ConfirmDialogEditSupplierComponent', () => {
  let component: ConfirmDialogEditSupplierComponent;
  let fixture: ComponentFixture<ConfirmDialogEditSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogEditSupplierComponent]
    });
    fixture = TestBed.createComponent(ConfirmDialogEditSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
