// product-information.component.ts

import {Component, EventEmitter, Input, Output} from '@angular/core';
import { AllProductsModel } from '../catalog/AllProductsModel';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.css']
})
export class ProductInformationComponent {

  @Input() productInfo: AllProductsModel | null = null;
  @Output() closeProductInformation: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  oncloseProductInformation() {
    this.closeProductInformation.emit();
  }
}
