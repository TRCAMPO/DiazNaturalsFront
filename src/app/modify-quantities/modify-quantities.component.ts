
import {AuthService} from "../auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {
  ConfirmDialogComponentDeleteProduct
} from "../confirm-dialog-delete-product/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UserModelClient} from "../create-user/userClient.model";
import {AllProductsModel} from "../catalog/AllProductsModel";
import {SearchProductModel} from "../confirm-dialog-delete-product/searchProductModel";
import {ProductModel} from "../create-product/product.model";
import {CategoryModel} from "../create-product/category.model";
import {PresentationsModel} from "../create-product/presentation.model";
import {SuppliersModel} from "../create-product/suppliers.model";
import {Component, OnInit} from "@angular/core";
import {catchError, ignoreElements} from "rxjs";

@Component({
  selector: 'app-modify-quantities',
  templateUrl: './modify-quantities.component.html',
  styleUrls: ['./modify-quantities.component.css']
})
export class ModifyQuantitiesComponent implements OnInit{
  products: AllProductsModel[] = [];
  productsOriginTwo: AllProductsModel[] = [];
  productsOrigin: AllProductsModel[] = [];
  categories: CategoryModel[] = [];
  presentations: PresentationsModel[] = []
  suppliers: SuppliersModel[] = [];
  // @ts-ignore
  private blob: Blob;
  currentPage = 1;
  elementeForPage = 1;
  constructor(public dialog: MatDialog, private toast: ToastrService, public authService: AuthService, public router: Router)  {

  }
  ngOnInit() {
    this.authService.formSearchProduct = new ProductModel();
    this.authService.getAllProductsActive().subscribe((response) => {
      this.productsOrigin = response;
      this.productsOriginTwo = response;
      this.productsOrigin.forEach(imgProduct => {
        console.log(imgProduct.image);
        this.authService.getImageByName(this.formatImageName(imgProduct.image)).subscribe((imageBlob: Blob) => {
          this.blob = imageBlob;
          const reader = new FileReader();
          reader.onload = () => {
            imgProduct.imageNewUrl = reader.result as string; // Convierte el Blob en una URL de datos
          };
          reader.readAsDataURL(imageBlob); // Lee el Blob como una URL de datos
        }, error => {
          console.error('Error al cargar la imagen', error);
        });
      });
    });
    this.authService.formDataProduct = new ProductModel();
    this.authService.formDataSearchProduct = new SearchProductModel();
    this.authService.getCategories().subscribe(data => {
      this.categories = data;
    });
    this.authService.getPresentation().subscribe(data => {
      this.presentations = data;
    });
    this.authService.getSuppliersAll().subscribe(data => {
      this.suppliers = data;
    });

  }

  formatImageName(name:string){
    return name.replace(/ /g, "%20");
  }

  searchProduct() {
    if (this.authService.formSearchProduct.name == null) {
      this.toast.info("No ha ingresado el producto", "Ingrese el Producto");
    } else if (!this.isValidateSpacesSearchSuppliers()) {
      this.toast.info("No ha seleccionado el proveedor", "Ingrese el Proveedor");
    } else if (!this.isValidateSpacesSearchPresentation()) {
      this.toast.info("No ha seleccionado la presentación", "Ingrese la presentación");
    } else {

      this.load();
      this.products = this.productsOrigin;
      if (this.authService.formDataSearchProduct.suppliers && this.authService.formDataSearchProduct.suppliers.length > 0) {
        // Filtrar por proveedores
        this.products = this.products.filter(product =>
          this.authService.formDataSearchProduct.suppliers.includes(product.supplier)
        );
      }

      if (this.authService.formDataSearchProduct.presentation && this.authService.formDataSearchProduct.presentation.length > 0) {
        // Filtrar por categorías
        this.products = this.products.filter(product =>
          this.authService.formDataSearchProduct.presentation.includes(product.presentation)
        );
      }

      if (this.authService.formSearchProduct.name) {
        // Filtrar por búsqueda de texto
        this.products = this.products.filter(product =>
          product.name.includes(this.authService.formSearchProduct.name)
        );
      }
      if (this.products.length == 0) {
        this.products = [];
        this.toast.info("No se ha encontrado ningun producto", "No se encontro el producto")
      }
    }

  }

  isValidateSpacesSearchSuppliers() {
    return this.authService.formDataSearchProduct.suppliers !== "" && this.authService.formDataSearchProduct.suppliers !== null;
  }

  isValidateSpacesSearchPresentation() {
    return this.authService.formDataSearchProduct.presentation !== "" && this.authService.formDataSearchProduct.presentation !== null;
  }


  onSubmit() {
    if(this.products.length > 0){
      if (this.authService.formDataAmount && this.authService.formDataAmount > 0) {
        this.authService.formDataDelete.idProduct = this.authService.formDataProduct.idProduct;
        this.authService.formDataSearchProduct.search = this.authService.formSearchProduct.name;
        const prod = this.authService.formDataSearchProduct;
        this.authService.patchQuantity(prod, this.authService.formDataAmount)
          .pipe(
            catchError(error => {
              // Manejo de errores aquí, puedes mostrar un mensaje de error o realizar otras acciones necesarias.
              console.error('Error en la solicitud PATCH:', error);
              return []; // Otra opción es retornar un observable vacío o un valor por defecto
            })
          )
          .subscribe(response => {
            // Manejo de la respuesta exitosa aquí, si es necesario.
            console.log('Respuesta exitosa:', response);
            this.loadTwo(); // Llama a loadTwo() después de la respuesta exitosa.
          }, error => {
            // Manejo de errores de la subscripción
            console.error('Error en la subscripción:', error);
          });
        this.authService.formDataAmount = null;
      } else {
        this.toast.error("Ingrese un número mayor a 0", "Número Inválido");
      }
      setTimeout(() => {
        this.loadTwo();
      }, 2000);
      this.toast.success("Se agrego la cantidad", "Cantidad Agregada")
    }else {
      this.toast.error("No ha buscado un producto", "Error Incrementando cantidad")
    }
  }


  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponentDeleteProduct, {
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
    this.authService.formDataProduct = new ProductModel();
    this.products = [];
    this.ngOnInit();
  }

  private load() {
    this.authService.getAllProductsActive().subscribe((response) => {
      this.productsOrigin = response;
      this.productsOrigin.forEach(imgProduct => {
        this.authService.getImageByName(this.formatImageName(imgProduct.image)).subscribe((imageBlob: Blob) => {
          this.blob = imageBlob;
          const reader = new FileReader();
          reader.onload = () => {
            imgProduct.imageNewUrl = reader.result as string; // Convierte el Blob en una URL de datos
          };
          reader.readAsDataURL(imageBlob); // Lee el Blob como una URL de datos
        }, error => {
          console.error('Error al cargar la imagen', error);
        });
      });
    });
  }

  private loadTwo() {
    this.load();
    this.searchProduct();
  }
}
