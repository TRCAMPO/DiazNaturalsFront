import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../auth.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { DataService } from "../shared/data.service";
import { ToastrService } from "ngx-toastr";
import {SharedDataServiceOrdersUsers} from "../list-orders-users/SharedDataServiceOrdersUsers";
import {OrdersModel} from "../list-orders/ordersModel";

@Component({
  selector: 'app-validate-payment-user',
  templateUrl: './validate-payment-user.component.html',
  styleUrls: ['./validate-payment-user.component.css']
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

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public sanitizer: DomSanitizer,
    private route: Router,
    private dataService: DataService,
    private toast: ToastrService,
    private sharedDataService: SharedDataServiceOrdersUsers
  ) {
    // APIs
  }

  ngOnInit(): void {
    // Simula una llamada a la API para obtener los detalles del pedido.
    this.sharedDataService.currentProductData.subscribe((data) => {
      console.log(data);
      this.orderDetails = data;
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

  onSubmit() {
    // Implementa la lógica para procesar el envío del formulario si es necesario.
  }

  openConfirmationDialogOrder() {
    // Implementa la lógica para abrir un diálogo de confirmación del pedido si es necesario.
  }

  changePageOrder() {
    this.route.navigate(['/homePageUser']);
  }

  formatImageName(name: string) {
    return name.replace(/ /g, "%20");
  }

  loadImage(nameImage: string) {
    console.log(nameImage);
    // Supongamos que obtienes la imagen del pedido desde tu API.
    this.fetchOrderImage(nameImage); // Implementa esta función para cargar la imagen del pedido.
  }

  blobToFile(blob: Blob, fileName: string, mimeType: string): File {
    return new File([blob], fileName, { type: mimeType });
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

  fetchOrderDetails() {
    // Simula una llamada a la API para obtener los detalles del pedido.
    // Actualiza this.imageFilePaymentUser con los datos del pedido.
  }

  fetchOrderImage(imageName: string) {
    // Simula una llamada a la API para obtener la imagen del pedido.
    // Actualiza this.blob y this.imageUrlOrder con la imagen del pedido.
  }
}
