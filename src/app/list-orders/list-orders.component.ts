import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth.service";
import {SupplierModel} from "../create-supplier/supplier.model";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {SharedDataServiceOrders} from "./shareDataServiceOrders";
import {ConfirmDialogDeleteSupplierComponent} from "../confirm-dialog-delete-supplier/confirm-dialog-delete-supplier.component";
import {MatDialog} from "@angular/material/dialog";
import {OrdersModel} from "./ordersModel";
import {StatusModel} from "./status.model";

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
        // @ts-ignore
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
    } else {
      // Obtener todas las órdenes si no hay término de búsqueda
      this.authService.getOrders().subscribe(
        (data) => {
          this.orders = data;
        },
        () => {
          this.toast.error("No se pudieron encontrar ordenes", "Error en la Búsqueda");
        }
      );
    }

    // Filtrar por fecha
    if (this.authService.formDataSearchOrder.date) {
      const selectedDate = new Date(this.authService.formDataSearchOrder.date);
      this.orders = this.orders.filter(order => {
        const orderDate = new Date(order.startDateOrder); // Asegúrate de tener la propiedad correcta para la fecha en tu modelo
        console.log(orderDate.toDateString());
        console.log(selectedDate.toDateString());
        return orderDate.toDateString() === selectedDate.toDateString();
      });
    }

    // Filtrar por estado
    if (this.authService.formDataSearchOrder.state) {
      this.orders = this.orders.filter(order => order.statusOrder === this.authService.formDataSearchOrder.state);
    }
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

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogDeleteSupplierComponent, {
      panelClass: 'custom-dialog-overlay', // Clase CSS personalizada
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmit();
      } else {
      }
    });
  }

  resetForm() {
    this.authService.formDataSupplier = new SupplierModel();
    this.authService.getOrders().subscribe(
      (data) => {
        this.orders = data;
        this.ordersOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar proveedores", "Error en la Búsqueda");
      }
    );
  }

}

