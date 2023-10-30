// shared-data.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataServiceOrders {
  private productData = new BehaviorSubject<any>(null);
  currentProductData = this.productData.asObservable();

  setProductData(data: any) {
    this.productData.next(data);
  }
  clearProductData() {
    this.productData.next(null);
  }

}
