import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogDeleteSupplierComponent } from './confirm-dialog-delete-supplier.component';

describe('ConfirmDialogDeleteSupplierComponent', () => {
  let component: ConfirmDialogDeleteSupplierComponent;
  let fixture: ComponentFixture<ConfirmDialogDeleteSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogDeleteSupplierComponent]
    });
    fixture = TestBed.createComponent(ConfirmDialogDeleteSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
