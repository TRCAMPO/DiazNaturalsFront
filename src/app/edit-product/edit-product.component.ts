import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from '@angular/platform-browser';
import {CategoryModel} from "../create-product/category.model";
import {PresentationsModel} from "../create-product/presentation.model";
import {SuppliersModel} from "../create-product/suppliers.model";
import {ProductModel} from "../create-product/product.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog-edit-product/confirm-dialog.component";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{
  inputValue: string = '';
  username: string;
  password: string;
  error: string;
  imageFile: File | null = null;
  imageUrl: string | null = null;
  // @ts-ignore
  @ViewChild('fileInput') fileInputRef: ElementRef;
  categories: CategoryModel[] = [];
  presentations: PresentationsModel[] = []
  suppliers: SuppliersModel[] = [];
  // @ts-ignore
  private blob: Blob;

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
    this.authService.getProductById(1).subscribe(data => {
      this.authService.formDataProduct = data;
      this.loadImage(this.authService.formDataProduct.image);
    });
  }

  formatImageName(name:string){
    return name.replace(/ /g, "%20");
  }

  loadImage(nameImage:string) {
    console.log(this.authService.formDataProduct.image);
    console.log(this.formatImageName(nameImage));
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



  private originalStyles: { [key: string]: string } = {};
  constructor(public dialog: MatDialog, public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.username = "";
    this.password = "";
    this.error = "";
  }

  blobToFile(blob: Blob, fileName: string, mimeType: string): File {
    const file = new File([blob], fileName, { type: mimeType });
    return file;
  }

  onSubmit() {
    if (this.imageFile == null){
      this.imageFile = this.blobToFile(this.blob, this.authService.formDataProduct.name , "jpg");
    }
    this.authService.uploadImg(this.imageFile).pipe(
      switchMap((res: any) => {
        this.toast.success('Imagen subida con exito', 'Productos');
        this.authService.formDataUrl = res;
        this.authService.formDataProduct.image = this.authService.formDataUrl.fileName;
        return this.authService.putProduct(this.authService.formDataProduct);
      })
    ).subscribe(
      (response: any) => {
        this.toast.success('Se ha editado el producto exitosamente', 'Modificación de Producto');
        this.clearPreview();
        this.resetForm();
        this.route.navigate(['/homePage']);
      },
      (error) => {
        this.toast.error('Fallo la edición del producto', 'Modificación de Producto');
      }
    );
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

  updateInputValue() {
    this.dataService.setInputValue(this.inputValue);
  }

  resetForm() {
    this.authService.formDataProduct = new ProductModel();
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

    const imageUrl = URL.createObjectURL(blob);
    this.imageUrl = imageUrl;
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
    this.route.navigate(['/homePage']);
  }

  searchProduct() {
    this.authService.getProductByNameCategorySupplier(this.authService.formDataSearchProduct).subscribe(
      (data) => {
        this.authService.formDataProduct = data;
        this.loadImage(this.authService.formDataProduct.image);
        this.toast.success("Se encontro el producto","Producto Encontrado")
      },
      (error) => {
        // Manejar errores si ocurren
        this.toast.error("No se pudo encontrar el producto", "Error en la Búsqueda");
      }
    );
  }
}
