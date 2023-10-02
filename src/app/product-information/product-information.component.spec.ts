import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInformationComponent } from './product-information.component';

describe('ProductInformationComponent', () => {
  let component: ProductInformationComponent;
  let fixture: ComponentFixture<ProductInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductInformationComponent]
    });
    fixture = TestBed.createComponent(ProductInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
