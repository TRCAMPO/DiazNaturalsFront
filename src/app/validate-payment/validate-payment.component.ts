import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../auth.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {OrdersModel} from "../list-orders/ordersModel";
import {AllProductsModel} from "../catalog/AllProductsModel";
import {StatusModel} from "../list-orders/status.model";

@Component({
  selector: 'app-validate-payment',
  templateUrl: './validate-payment.component.html',
  styleUrls: ['./validate-payment.component.css']
})
export class ValidatePaymentComponent implements OnInit {

  orderDetails: OrdersModel = new OrdersModel(); // Objeto para almacenar los detalles del pedido
  // @ts-ignore
  private blob: Blob;
  disabledInput: boolean = true;
  selectedStatus: any;
  statusArray: StatusModel[] = [];
  products: AllProductsModel[] = [];
  currentPage = 1;
  elementeForPage = 5;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public sanitizer: DomSanitizer,
    private route: Router,
    private dataService: DataService,
    private toast: ToastrService
  ) {
  }

  ngOnInit(): void {
    const storedData = localStorage.getItem('orderData');
    if (storedData) {
      this.orderDetails = JSON.parse(storedData);
    } else {
      console.log('No hay datos almacenados');
    }
    this.selectedStatus = this.orderDetails.statusOrder;

      // Después de obtener los detalles del pedido, obtén los productos y la imagen del pedido
      this.authService.getProductsOrders(this.orderDetails.idOrder).subscribe((productsData) => {
        this.products = productsData;

        // Luego, puedes cargar la imagen del pedido si es necesario.
        this.authService.getImagePayment(this.formatImageName(this.orderDetails.imageOrder)).subscribe((imageBlob: Blob) => {
          this.blob = imageBlob;
          const reader = new FileReader();
          reader.onload = () => {
            this.orderDetails.imageNewUrl = reader.result as string; // Convierte el Blob en una URL de datos
          };
          reader.readAsDataURL(imageBlob); // Lee el Blob como una URL de datos

          // Después de obtener la imagen del pedido, puedes iterar sobre los productos.
          this.products.forEach(imgProduct => {
            this.authService.getImageByName(this.formatImageName(imgProduct.image)).subscribe((productImageBlob: Blob) => {
              const productReader = new FileReader();
              productReader.onload = () => {
                imgProduct.imageNewUrl = productReader.result as string; // Convierte el Blob en una URL de datos
              };
              productReader.readAsDataURL(productImageBlob); // Lee el Blob como una URL de datos
            }, error => {
              console.error('Error al cargar la imagen del producto', error);
            });
          });
        }, error => {
          console.error('Error al cargar la imagen del pedido', error);
        });
      }, error => {
        console.error('Error al obtener los productos del pedido', error);
      });
      this.authService.getStatesOrders().subscribe(
      (data) =>{
        this.statusArray = data;
      },
    );
  }

  changePage() {
    this.route.navigate(['/homePage']);
  }

  formatImageName(name: string) {
    return name.replace(/ /g, "%20");
  }

  changeStatus() {

  }

  openConfirmationDialogPayment() {

  }
}
