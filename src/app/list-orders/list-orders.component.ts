import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
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
  constructor(public dialog: MatDialog, private toast: ToastrService, public authService: AuthService, public router: Router)  {
    this.authService.formDataSearchOrder = new OrderSearchModel();
    this.authService.formDataSearchOrder.date = null;
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

    // Filtrar por proveedor
    if (this.authService.formDataSearchOrder.search) {
      this.orders = this.orders.filter(order =>
        order.nameClient.toLowerCase().includes(this.authService.formDataSearchOrder.search.toLowerCase()) ||
        order.nitClient.toString().includes(this.authService.formDataSearchOrder.search) ||
        order.idOrder.toString().includes(this.authService.formDataSearchOrder.search)
      );
    }

    //Filtrar por fecha
    if (this.authService.formDataSearchOrder.date) {
      const selectedDate = new Date(this.authService.formDataSearchOrder.date);
      selectedDate.setDate(selectedDate.getDate() + 1);
      this.orders = this.orders.filter(order => {
        const orderDate = new Date(order.startDateOrder);
        return orderDate.getDate() === selectedDate.getDate();
      });
    }

    // Filtrar por estado
    if (this.authService.formDataSearchOrder.state) {
      this.orders = this.orders.filter(order =>{ return order.statusOrder === this.authService.formDataSearchOrder.state;});
    }
  }

  showOrder(item: OrdersModel){
    localStorage.setItem('orderData', JSON.stringify(item));
    this.router.navigate(['/validatePayment']);
  }

  onSubmit() {
    this.authService.formDataDeleteSupplier.nitSupplier = this.authService.formDataSupplier.nitSupplier;
    this.authService.formDataDeleteSupplier.isActive = false;
    this.authService.formDataSupplier.phoneSupplier = this.authService.formDataSupplier.phoneSupplier+"";
    this.authService.patchSupplier(this.authService.formDataDeleteSupplier).subscribe(
      response => {
        this.toast.success("Proveedor eliminado correctamente", "Proveedor Eliminado");
        this.resetForm();
      },
      error => {
        this.toast.error("Surgio un problema en la eliminación", "Usuario no Eliminado");
      }
    );
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

