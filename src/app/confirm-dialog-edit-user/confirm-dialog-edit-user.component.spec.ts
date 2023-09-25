import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogEditUserComponent } from './confirm-dialog-edit-user.component';

describe('ConfirmDialogEditUserComponent', () => {
  let component: ConfirmDialogEditUserComponent;
  let fixture: ComponentFixture<ConfirmDialogEditUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogEditUserComponent]
    });
    fixture = TestBed.createComponent(ConfirmDialogEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
