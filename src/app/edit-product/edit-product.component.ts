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
import {ConfirmDialogComponent} from "../confirm-dialog-edit-product/confirm-dialog.component";
import {switchMap} from "rxjs";
import {SearchProductModel} from "../confirm-dialog-delete-product/searchProductModel";
import {compareNumbers} from "@angular/compiler-cli/src/version_helpers";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css', './edit-product2.component.css']
})
export class EditProductComponent implements OnInit{
  imageFile: File | null = null;
  imageUrl: string | null = null;
  // @ts-ignore
  @ViewChild('fileInput') fileInputRef: ElementRef;
  categories: CategoryModel[] = [];
  presentations: PresentationsModel[] = []
  suppliers: SuppliersModel[] = [];
  // @ts-ignore
  private blob: Blob;
  disabledInput: boolean = true;

  constructor(public dialog: MatDialog, public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.authService.formDataProduct = new ProductModel();
    this.authService.formDataSearchProduct = new SearchProductModel();
  }

  ngOnInit() {
    this.authService.getCategories().subscribe(data => {
      this.categories = data;
    });
    this.authService.getPresentation().subscribe(data => {
      this.presentations = data;
    });
    this.authService.getSuppliers().subscribe(data => {
      this.suppliers = data;
    });
  }

  activateCamp() {
    this.disabledInput = false;
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

  blobToFile(blob: Blob, fileName: string, mimeType: string): File {
    return new File([blob], fileName, { type: mimeType });
  }

  onSubmit() {
    if (this.imageFile == null) {
      this.imageFile = this.blobToFile(this.blob, this.authService.formDataProduct.name, "jpg");
    }
    if(this.isValidAmountPrice(this.authService.formDataProduct)){
      this.toast.info("Por favor ingrese una cantidad y precio válidos", "Formato Incorrecto");
    } else if(this.isPositiveNumberValid(this.authService.formDataProduct)) {
      this.toast.info("Por favor ingrese una cantidad válida", "Cantidad Incorrecta");
    }else if (this.isPositiveNumberValid2(this.authService.formDataProduct)) {
      this.toast.info("Por favor ingrese un precio válido", "Precio Incorrecto");
    }else if(!this.checkProductFields(this.authService.formDataProduct)){
      this.toast.info("Por favor llene todos los campos","Formulario Incompleto");
    }else if(!this.isPositiveNumber(this.authService.formDataProduct.amount)) {
      this.toast.info("Por favor ingrese una cantidad válida", "Cantidad Incorrecta");
    }else if(!this.isPositiveNumber(this.authService.formDataProduct.price)){
          this.toast.info("Por favor ingrese un precio válido", "Precio Incorrecto");
    }else {
        this.authService.uploadImg(this.imageFile).pipe(
          switchMap((res: any) => {
            this.toast.success('Imagen subida con exito', 'Productos');
            this.authService.formDataUrl = res;
            this.authService.formDataProduct.image = this.authService.formDataUrl.fileName;
            return this.authService.putProduct(this.authService.formDataProduct);
          })
        ).subscribe(
          () => {
            this.toast.success('Se ha editado el producto exitosamente', 'Modificación de Producto');
            this.clearPreview();
            this.resetForm();
            this.route.navigate(['/homePage']);
          },
          (error) => {
            if (error.status == 409){
              this.toast.error(error.error, 'Modificación de Producto');
            }else {
              this.toast.error('Fallo la edición del producto', 'Modificación de Producto');
            }
          }
        );
    }
  }

  checkProductFields(product: ProductModel): boolean {
    if (
      product === null ||
      product === undefined ||
      product.name === '' ||
      product.supplier === '' ||
      product.price === null ||
      product.amount === null ||
      product.presentation === '' ||
      product.category === '' ||
      product.description === '' ||
      this.imageFile === null
    ) {
      return false;
    }
    return true;
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
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

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    // @ts-ignore
    const file = target.files[0];
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
    this.resetForm();
    this.route.navigate(['/homePage']);
  }

  searchProduct() {
    if (this.authService.formDataSearchProduct.search == "" || this.authService.formDataSearchProduct.search == null) {
      this.toast.info("No ha ingresado el producto", "Ingrese el Producto");
    } else if (!this.isValidateSpacesSearchSuppliers()) {
      this.toast.info("No ha seleccionado el proveedor", "Ingrese el Proveedor");
    } else if (!this.isValidateSpacesSearchPresentation()) {
      this.toast.info("No ha seleccionado la presentación", "Ingrese la presentación");
    } else {
      this.authService.getProductByNameCategorySupplier(this.authService.formDataSearchProduct).subscribe(
        (data) => {
          this.authService.formDataProduct = data;
          this.loadImage(this.authService.formDataProduct.image);
          this.activateCamp();
          this.toast.success("Se encontro el producto", "Producto Encontrado")
        },
        () => {
          // Manejar errores si ocurren
          this.toast.error("No se pudo encontrar el producto", "Error en la Búsqueda");
        }
      );
    }
  }

  isPositiveNumber(number: string|number|null): boolean {
    number = number+"";
    if(/[^0-9]/.test(number)){return false;}
    return true;
  }

  isValidateSpacesSearchSuppliers() {
    return this.authService.formDataSearchProduct.suppliers !== "" && this.authService.formDataSearchProduct.suppliers !== null;
  }

  isValidateSpacesSearchPresentation() {
    return this.authService.formDataSearchProduct.presentation !== "" && this.authService.formDataSearchProduct.presentation !== null;
  }

  isPositiveNumberValid2(product: ProductModel): boolean {
    if (
      product === null ||
      product === undefined ||
      product.name === '' ||
      product.supplier === '' ||
      product.price !== null ||
      product.amount === null ||
      product.presentation === '' ||
      product.category === '' ||
      product.description === '' ||
      this.imageFile === null
    ) {
      return false;
    }
    return true;
  }

  isPositiveNumberValid(product: ProductModel): boolean {
    if (
      product === null ||
      product === undefined ||
      product.name === '' ||
      product.supplier === '' ||
      product.price === null ||
      product.amount !== null ||
      product.presentation === '' ||
      product.category === '' ||
      product.description === '' ||
      this.imageFile === null
    ) {
      return false;
    }
    return true;
  }

  isValidAmountPrice(product: ProductModel): boolean {
    if (
      product === null ||
      product === undefined ||
      product.name === '' ||
      product.supplier === '' ||
      product.price !== null ||
      product.amount !== null ||
      product.presentation === '' ||
      product.category === '' ||
      product.description === '' ||
      this.imageFile === null
    ) {
      return false;
    }
    return true;
  }

}
