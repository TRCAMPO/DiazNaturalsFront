import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import {Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from '@angular/platform-browser';
import {CategoryModel} from "../create-product/category.model";
import {PresentationsModel} from "../create-product/presentation.model";
import {SuppliersModel} from "../create-product/suppliers.model";
import {ProductModel} from "../create-product/product.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponentDeleteProduct} from "../confirm-dialog-delete-product/confirm-dialog.component";
import {SearchProductModel} from "../confirm-dialog-delete-product/searchProductModel";

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css','./delete-product2.component.css']
})
export class DeleteProductComponent implements OnInit{
  imageFile: File | null = null;
  imageUrl: string | null = null;
  // @ts-ignore
  @ViewChild('fileInput') fileInputRef: ElementRef;
  categories: CategoryModel[] = [];
  presentations: PresentationsModel[] = []
  suppliers: SuppliersModel[] = [];
  // @ts-ignore
  private blob: Blob;

  constructor(public dialog: MatDialog, public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
  }

  ngOnInit() {
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

  loadImage(nameImage:string) {
    this.authService.getImageByName(this.formatImageName(nameImage)).subscribe((imageBlob: Blob) => {
      this.blob = imageBlob;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string; // Convierte el Blob en una URL de datos
      };
      reader.readAsDataURL(imageBlob); // Lee el Blob como una URL de datos
    }, error => {
      console.error('Error al cargar la imagen', error);
    });
  }

  onSubmit() {
    this.authService.formDataDelete.idProduct = this.authService.formDataProduct.idProduct;
    this.authService.formDataDelete.isActive = false;
    this.authService.patchProduct(this.authService.formDataDelete).subscribe(
      () => {
         this.toast.success("Se elimino correctamente el producto", "Producto Eliminado");
         this.resetForm();
      },
      () => {
          this.toast.error("No se pudo eliminar el producto", "Producto No Eliminado");
      }
    );
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponentDeleteProduct, {
      panelClass: 'custom-dialog-overlay',
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
    this.authService.formDataSearchProduct = new SearchProductModel();
    this.clearPreview();
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
    this.imageFile = new File([blob], file.name, {type: 'image/jpeg'});
    this.imageUrl = URL.createObjectURL(blob);
  }

  clearPreview() {
    this.imageUrl = null;
    this.imageFile = null;
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = null;
    }
  }

  changePage() {
    this.route.navigate(['/homePage']);
    this.resetForm();
  }

  searchProduct() {
    if (this.authService.formDataSearchProduct.search == "" || this.authService.formDataSearchProduct.search == null) {
      this.toast.info("No ha ingresado el producto", "Ingrese el Producto");
    } else if (!this.isValidateSpacesSearchSuppliers()) {
      this.toast.info("No ha seleccionado el proveedor", "Ingrese el Proveedor");
    } else if (!this.isValidateSpacesSearchPresentation()) {
      this.toast.info("No ha seleccionado la presentación", "Ingrese la presentación");
    } else {
      this.authService.getProductByNamePresentationSupplier(this.authService.formDataSearchProduct).subscribe(
        (data) => {
          this.authService.formDataProduct = data;
          this.loadImage(this.authService.formDataProduct.image);
          this.toast.success("Se encontro el producto", "Producto Encontrado")
        },
        () => {
          // Manejar errores si ocurren
          this.toast.error("No se pudo encontrar el producto", "Error en la Búsqueda");
        }
      );
    }
  }

  isValidateSpacesSearchSuppliers() {
    console.log(this.authService.formDataSearchProduct.suppliers !== "" && this.authService.formDataSearchProduct.suppliers !== null);
    return this.authService.formDataSearchProduct.suppliers !== "" && this.authService.formDataSearchProduct.suppliers !== null;
  }

  isValidateSpacesSearchPresentation() {
    return this.authService.formDataSearchProduct.presentation !== "" && this.authService.formDataSearchProduct.presentation !== null;
  }

}

