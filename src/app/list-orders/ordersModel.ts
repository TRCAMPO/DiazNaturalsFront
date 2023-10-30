export class OrdersModel {
  idOrder:number = 0;
  idClient:number = 0;
  nitClient:string = '';
  nameClient: string = "";
  stateClient: string | undefined = "";
  cityClient: string = "";
  addressClient: string = "";
  phoneClient: string = '';
  nameContactClient:string = "";
  startDateOrder: Date = new Date();
  imageOrder: string = "";
  statusOrder: string = "";
  totalPriceOrder: number = 0;




}
