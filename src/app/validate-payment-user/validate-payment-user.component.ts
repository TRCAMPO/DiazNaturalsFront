import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../auth.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {OrdersModel} from "../list-orders/ordersModel";
import {switchMap} from "rxjs";
import {ImageUserModel} from "./ImageUser.model";
import {AllProductsModel} from "../catalog/AllProductsModel";
import {OrderHistory} from "../validate-payment/OrderHistoryModel";
import {ProgressModel} from "./progress.model";

@Component({
  selector: 'app-validate-payment-user',
  templateUrl: './validate-payment-user.component.html',
  styleUrls: ['./validate-payment-user.component.css', './validate-payment-user.component2.css']
})
export class ValidatePaymentUserComponent implements OnInit {

  orderDetails: OrdersModel = new OrdersModel(); // Objeto para almacenar los detalles del pedido
  imageFilePaymentUser: File | null = null;
  imageUrlOrder: string | null = null;
  // @ts-ignore
  @ViewChild('fileInput') fileInputRef: ElementRef;
  // @ts-ignore
  private blob: Blob;
  disabledInput: boolean = true;
  currentPage = 1;
  elementeForPage = 5;
  products: AllProductsModel[] = [];
  orderHistoryUser = new OrderHistory();

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
    this.authService.getProductsOrders(this.orderDetails.idOrder).subscribe((productsData) => {
      this.products = productsData;
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
      console.error('Error al obtener los productos del pedido', error);
    });

    // Luego, puedes cargar la imagen del pedido si es necesario.
    this.authService.getImagePayment(this.formatImageName(this.orderDetails.imageOrder)).subscribe((imageBlob: Blob) => {
      this.blob = imageBlob;
      const reader = new FileReader();
      reader.onload = () => {
        this.orderDetails.imageNewUrl = reader.result as string; // Convierte el Blob en una URL de datos
      };
      reader.readAsDataURL(imageBlob); // Lee el Blob como una URL de datos
    }, error => {
      console.error('Error al cargar la imagen', error);
    });
  }

  cancelAnOrder() {
    this.orderHistoryUser.idOrder = this.orderDetails.idOrder;
    this.orderHistoryUser.nameStatus = "Pedido Cancelado";
    this.orderHistoryUser.dateOrderHistory = new Date();
    console.log(this.orderHistoryUser);
    this.authService.postOrderHistory(this.orderHistoryUser).subscribe(response => {
      this.toast.success("Pedido Cancelado Correctamente", "Cancelación de Pedido");
      this.route.navigate(['listOrdersUser']);
    },
      error => {
        this.toast.success("Surgió un problema al hacer la actualización", "Cancelación de Pedido");
    });
  }

  formatImageName(name: string) {
    return name.replace(/ /g, "%20");
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // @ts-ignore
    const file = event.dataTransfer.files[0];
    const blob = file.slice(0, file.size, file.type.replace(/\/(jpeg|png|gif)$/, '/jpg'));
    this.imageFilePaymentUser = new File([blob], file.name, { type: 'image/jpeg' });
    this.imageUrlOrder = URL.createObjectURL(blob);
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    // @ts-ignore
    const file = target.files[0];
    const blob = file.slice(0, file.size, file.type.replace(/\/(jpeg|png|gif)$/, '/jpg'));
    this.imageFilePaymentUser = new File([blob], file.name, { type: 'image/jpeg' });
    this.imageUrlOrder = URL.createObjectURL(blob);
  }

  clearPreview() {
    this.imageUrlOrder = null;
    this.imageFilePaymentUser = null;
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = null;
    }
  }

  sendVoucher() {
    const imageModer:ImageUserModel = new ImageUserModel();
    imageModer.idOrder = this.orderDetails.idOrder;
    imageModer.imageOrder = this.orderDetails.imageOrder;
    this.authService.uploadImgPayment(this.imageFilePaymentUser, this.orderDetails.nameClient, this.orderDetails.idOrder)
      .pipe(
        switchMap((res: any) => {
          this.toast.success('Imagen subida con éxito', 'Comprobante');
          this.authService.formDataUrl = res;
          imageModer.imageOrder = this.authService.formDataUrl.fileName;
          this.orderDetails.imageOrder = this.authService.formDataUrl.fileName;
          return this.authService.putOrder(imageModer);
        })
      )
      .subscribe(
        (response) => {
          this.toast.success('Comprobante enviado', 'Comprobante');
          // Manejar la respuesta aquí
        },
        (error) => {
          this.toast.success('Error en el envio del comprobante', 'Comprobante');
          // Manejar el error aquí
        }
      );
    this.route.navigate(["/listOrdersUser"]);
  }

}
