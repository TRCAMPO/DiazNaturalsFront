import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrdersUsersComponent } from './list-orders-users.component';

describe('ListOrdersUsersComponent', () => {
  let component: ListOrdersUsersComponent;
  let fixture: ComponentFixture<ListOrdersUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOrdersUsersComponent]
    });
    fixture = TestBed.createComponent(ListOrdersUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
