import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogDeleteUserComponent } from './confirm-dialog-delete-user.component';

describe('ConfirmDialogDeleteUserComponent', () => {
  let component: ConfirmDialogDeleteUserComponent;
  let fixture: ComponentFixture<ConfirmDialogDeleteUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogDeleteUserComponent]
    });
    fixture = TestBed.createComponent(ConfirmDialogDeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
