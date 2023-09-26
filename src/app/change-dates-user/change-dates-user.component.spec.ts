import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDatesUserComponent } from './change-dates-user.component';

describe('ChangeDatesUserComponent', () => {
  let component: ChangeDatesUserComponent;
  let fixture: ComponentFixture<ChangeDatesUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeDatesUserComponent]
    });
    fixture = TestBed.createComponent(ChangeDatesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
