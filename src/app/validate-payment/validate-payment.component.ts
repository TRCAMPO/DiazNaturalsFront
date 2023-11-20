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
import {OrderHistory} from "./OrderHistoryModel";
import {ValidateQuantity} from "./ValidateQuantity";
import {catchError, forkJoin, mergeMap, of, switchMap, tap} from "rxjs";
import {Validators} from "@angular/forms";

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
  orderHistory = new OrderHistory();
  validateQuantity: ValidateQuantity[]=[];
  productsNotPassedValidation: ValidateQuantity[]=[]

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
      this.authService.getStatesOrders2(this.selectedStatus).subscribe(
      (data) =>{
        this.statusArray = data;
      },
    );
  }

  changePage() {
    this.route.navigate(['/listOrders']);
  }

  formatImageName(name: string) {
    return name.replace(/ /g, "%20");
  }

   changeStatus() {
     //this.authService.formDataOrderHistory = new OrderHistory()
     this.orderHistory.idOrder = this.orderDetails.idOrder;
     this.orderHistory.nameStatus = this.selectedStatus;
     this.orderHistory.dateOrderHistory = new Date();
     console.log(this.orderHistory);
     if (this.selectedStatus != "Despachado") {
       this.authService.postOrderHistory(this.orderHistory).subscribe(response => {
           this.toast.success("Estado actualizado correctamente", "Estado de pedido");
           this.route.navigate(['/listOrders']);
         },
         error => {
           this.toast.success("Surgio un problema al hacer la actualizacion", "Estado de pedido");
         }
       );
     } else {
       console.log("entro 1")
       this.extractDataForValidate();
       const validationObservables = this.validateQuantity.map(product => {
         return this.authService.getValidateProductByNamePresentationSupplier(product)
           .pipe(
             catchError(error => {
               // Captura el error y registra el producto no validado
               this.productsNotPassedValidation.push(product);
               this.toast.error("Cantidad Insuficiente de " + product.search +" "+ product.suppliers+" "+ product.presentation+" ", "Error en proceso");
               return of({error}); // Emite un objeto que indica un error
             })
           );
       });
// Combinar todas las observables de validación
       forkJoin(validationObservables).pipe(
         switchMap(validationResults => {
           // @ts-ignore
           const validationPassed = validationResults.every(result => !result.error); // Verifica si todos los productos pasaron la validación
           if (validationPassed) {
             console.log('Todas las validaciones fueron exitosas');
             // Realizar la actualización del estado si todas las validaciones pasaron
             return this.authService.postOrderHistory(this.orderHistory);
           } else {
             // @ts-ignore
             console.error('Los siguientes productos no pasaron la validación:', productsNotPassedValidation);
             return of(false); // Emitir un valor falso para indicar que no se debe realizar la actualización
           }
         }),
         tap(updateResult => {
           if (updateResult === false) {
             this.toast.error("Surgió un problema al hacer la actualización", "Error en proceso");

           } else {
            this.toast.success("Estado actualizado correctamente", "Estado de pedido");
             this.route.navigate(['/listOrders']);
           }
         })
       ).subscribe();
     }
   }

  changeStatusToCanceled() {

  }


  extractDataForValidate(){
    for (const product of this.products) {
      const validateQuantity: ValidateQuantity = new ValidateQuantity();
      validateQuantity.search = product.name;
      validateQuantity.suppliers = product.supplier;
      validateQuantity.presentation = product.presentation;
      validateQuantity.quantityProduct = product.quantity;
      this.validateQuantity.push(validateQuantity);
    }
  }
  openConfirmationDialogPayment() {

  }
}
