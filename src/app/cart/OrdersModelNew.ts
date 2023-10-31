import {ProductsOrderModel} from "./productsOrder.model";

export class OrdersModelNew {
  idClient:number = 0;
  startDateOrder:Date = new Date();
  totalPriceOrder:number = 0;
  addCart:ProductsOrderModel[] = [];
}
