import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../auth.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { DataService } from "../shared/data.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-validate-payment-user',
  templateUrl: './validate-payment-user.component.html',
  styleUrls: ['./validate-payment-user.component.css']
})
export class ValidatePaymentUserComponent implements OnInit {

  orderDetails: any; // Objeto para almacenar los detalles del pedido
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
    private toast: ToastrService
  ) {
    // APIs
  }

  ngOnInit(): void {
    // Simula una llamada a la API para obtener los detalles del pedido.
    this.orderDetails = {
      idOrder: 123,
      nitClient: "123456789",
      nameClient: "Nombre del Cliente",
      stateClient: "Estado del Cliente",
      cityClient: "Ciudad del Cliente",
      addressClient: "Dirección del Cliente",
      phoneClient: "123-456-7890",
      nameContactClient: "Contacto del Cliente",
      startDateOrder: new Date(),
      imageOrder: "nombre_de_la_imagen.jpg",
      statusOrder: "En proceso",
      totalPriceOrder: 1000
    };

    // Luego, puedes cargar la imagen del pedido si es necesario.
    if (this.orderDetails?.imageOrder) {
      this.loadImage(this.orderDetails.imageOrder);
    }
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
