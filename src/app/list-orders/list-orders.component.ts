import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {SharedDataServiceOrders} from "./shareDataServiceOrders";
import {MatDialog} from "@angular/material/dialog";
import {OrdersModel} from "./ordersModel";
import {StatusModel} from "./status.model";
import {OrderSearchModel} from "./OrderSearchModel";

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit{
  @Input() cartStyles: any;
  orders: OrdersModel[] = [];
  ordersOrigin: OrdersModel[] = [];
  currentPage = 1;
  elementeForPage = 5;
  status: StatusModel[] = [];
  constructor(public dialog: MatDialog, private toast: ToastrService, public authService: AuthService, public router: Router, private sharedDataService: SharedDataServiceOrders)  {

  }
  ngOnInit() {
    this.authService.getOrders().subscribe(
      (data) => {
        this.orders = data;
        this.ordersOrigin = data;

      },
      () => {
        this.toast.error("No se pudieron encontrar pedidos", "Error en la Búsqueda");
      }
    );

    this.authService.getStatesOrders().subscribe(
      (data) =>{
      this.status = data;
      },
    );
  }

  searchOrders() {
    this.authService.formDataOrder = new OrdersModel();
    this.orders = this.ordersOrigin;

    // Filtrar por fecha
    if (this.authService.formDataSearchOrder.date) {
      const selectedDate = new Date(this.authService.formDataSearchOrder.date);
      this.orders = this.orders.filter(order => {
        const orderDate = new Date(order.startDateOrder);
        return orderDate.getDate() === selectedDate.getDate();
      });
    }

    // Filtrar por proveedor
    if (this.authService.formDataSearchOrder.search) {
      this.orders = this.orders.filter(order =>
        order.nameClient.toLowerCase().includes(this.authService.formDataSearchOrder.search.toLowerCase()) ||
        order.nitClient.toString().includes(this.authService.formDataSearchOrder.search) ||
        order.idOrder.toString().includes(this.authService.formDataSearchOrder.search)
      );
    }

    // Filtrar por estado
    if (this.authService.formDataSearchOrder.state) {
      this.orders = this.orders.filter(order =>{ return order.statusOrder === this.authService.formDataSearchOrder.state;});
    }
  }

  resetForm() {
    this.authService.formDataSearchOrder = new OrderSearchModel();
    this.authService.getOrders().subscribe(
      (data) => {
        this.orders = data;
        this.ordersOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar pedidos", "Error en la Búsqueda");
      }
    );
  }

}

