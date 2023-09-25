import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSupplierComponent } from './delete-supplier.component';

describe('DeleteSupplierComponent', () => {
  let component: DeleteSupplierComponent;
  let fixture: ComponentFixture<DeleteSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteSupplierComponent]
    });
    fixture = TestBed.createComponent(DeleteSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
