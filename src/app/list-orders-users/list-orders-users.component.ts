import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {OrdersModel} from "../list-orders/ordersModel";
import {StatusModel} from "../list-orders/status.model";
import {OrderSearchModel} from "../list-orders/OrderSearchModel";
import {CookieService} from "ngx-cookie-service";
import {UserModelClient} from "../create-user/userClient.model";
import {mergeMap} from "rxjs";

@Component({
  selector: 'app-list-orders-users',
  templateUrl: './list-orders-users.component.html',
  styleUrls: ['./list-orders-users.component.css']
})
export class ListOrdersUsersComponent implements OnInit{
  @Input() cartStyles: any;
  orders: OrdersModel[] = [];
  ordersOrigin: OrdersModel[] = [];
  currentPage = 1;
  elementeForPage = 5;
  status: StatusModel[] = [];
  user: UserModelClient = new UserModelClient();
  constructor(private cookies: CookieService, public dialog: MatDialog, private toast: ToastrService, public authService: AuthService, public router: Router)  {
    this.removeStoredData();
    this.authService.formDataSearchOrder = new OrderSearchModel();
    this.authService.formDataSearchOrder.date = null;
  }

  removeStoredData() {
    // Elimina el elemento del almacenamiento local por su clave
    localStorage.removeItem('orderData');
  }

  ngOnInit() {
    this.authService.getUserByEmail(this.cookies.get("email")).pipe(
      mergeMap((user) => {
        this.user = user;
        return this.authService.getOrders();
      }),
      mergeMap((orders) => {
        this.orders = orders;
        this.ordersOrigin = orders;
        // Filtrar por proveedor
        this.orders = this.orders.filter(order =>
          order.idClient.toString().includes(this.user.idClient.toString())
        );

        this.ordersOrigin = this.ordersOrigin.filter(order =>
          order.idClient.toString().includes(this.user.idClient.toString())
        );

        return this.authService.getStatesOrders();
      })
    ).subscribe(
      (status) => {
        this.status = status;
        // Puedes realizar otras operaciones después de obtener el estado de las órdenes
      },
      (error) => {
        console.error("Error en alguna de las operaciones", error);
      }
    );
  }

  searchOrders() {
    this.authService.formDataOrder = new OrdersModel();
    this.orders = this.ordersOrigin;

    if (this.authService.formDataSearchOrder.search) {
      this.orders = this.orders.filter(order =>
        order.idOrder.toString().includes(this.authService.formDataSearchOrder.search)
      );
    }

    // Filtrar por fecha
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

  resetForm() {
    this.authService.formDataSearchOrder = new OrderSearchModel();
    this.ngOnInit();
  }

  showOrder(item: OrdersModel) {
    localStorage.setItem('orderData', JSON.stringify(item));
    if (item.imageOrder === "SinComprobanteDePago.jpeg") {
      this.router.navigate(['/validatePaymentUser']);
    } else {
      this.router.navigate(['/validatedOrder']);
    }
  }
}

