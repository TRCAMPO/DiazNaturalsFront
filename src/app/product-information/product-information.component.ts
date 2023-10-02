// product-information.component.ts

import { Component, Input } from '@angular/core';
import { AllProductsModel } from '../catalog/AllProductsModel';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.css']
})
export class ProductInformationComponent {

  @Input() productInfo: AllProductsModel | null = null;

  constructor() { }

  // Función para cerrar la ventana emergente
  closeProductInformation() {
    // Aquí puedes implementar la lógica para cerrar la ventana emergente
    // Puedes usar un EventEmitter para notificar al componente padre (catalog) que se debe cerrar la ventana.
  }
}
