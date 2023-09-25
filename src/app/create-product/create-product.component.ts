import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from '@angular/platform-browser';
import {CategoryModel} from "./category.model";
import {PresentationsModel} from "./presentation.model";
import {SuppliersModel} from "./suppliers.model";
import {ProductModel} from "./product.model";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css', './create-product2.component.css']
})
export class CreateProductComponent implements OnInit{
  imageFile: File | null = null;
  imageUrl: string | null = null;
  // @ts-ignore
  @ViewChild('fileInput') fileInputRef: ElementRef;
  categories: CategoryModel[] = [];
  presentations: PresentationsModel[] = []
  suppliers: SuppliersModel[] = [];

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
  constructor(public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.authService.formDataProduct = new ProductModel();
  }

  onSubmit() {
  // @ts-ignore
      if(!this.isPositiveNumber(this.authService.formDataProduct.amount)) {
        this.toast.info("Por favor ingrese una cantidad válida", "Cantidad Incorrecta");
      }else { // @ts-ignore
        if(!this.isPositiveNumber(this.authService.formDataProduct.price)){
          this.toast.info("Por favor ingrese un precio válido", "Precio Incorrecto");
        } else if(!this.checkProductFields(this.authService.formDataProduct)){
          this.toast.info("Por favor llene todos los campos","Formulario Incompleto");
        } else {
          this.authService.uploadImg(this.imageFile).pipe(
          switchMap((res: any) => {
          this.toast.success('Imagen subida con exito', 'Productos');
          this.authService.formDataUrl = res;
          this.authService.formDataProduct.image = this.authService.formDataUrl.fileName;
          return this.authService.postProduct(this.authService.formDataProduct);
        })
      ).subscribe(
        () => {
          this.toast.success('Se ha creado el producto exitosamente', 'Creación de Producto');
          this.clearPreview();
          this.resetForm();
        },
        (error) => {
          if (error.status == 409) {
            this.toast.error(error.error, 'Creacion de Producto');
          } else {
            this.toast.error('Fallo la creacion de producto', 'Creacion de Producto');
          }
        }
      );
    }
    }
  }

  isPositiveNumber(number: string|number): boolean {
    number = number+"";
    if(/[^0-9]/.test(number)){return false;}
    return true;
  }

  checkProductFields(product: ProductModel): boolean {
    // Verifica si alguno de los campos es nulo o tiene un valor de inicialización
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
      return false; // Al menos uno de los campos es nulo o tiene un valor de inicialización
    }
    return true; // Todos los campos tienen valores válidos
  }


  resetForm() {
    this.authService.formDataProduct = new ProductModel();
    this.clearPreview();
    this.route.navigate(["/homePage"]);
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
}
