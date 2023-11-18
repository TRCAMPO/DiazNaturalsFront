import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyQuantitiesComponent } from './modify-quantities.component';

describe('ModifyQuantitiesComponent', () => {
  let component: ModifyQuantitiesComponent;
  let fixture: ComponentFixture<ModifyQuantitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyQuantitiesComponent]
    });
    fixture = TestBed.createComponent(ModifyQuantitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
