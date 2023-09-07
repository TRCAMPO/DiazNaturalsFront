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
    this.authService.getProductById(2).subscribe(data => {
      this.authService.formDataProduct = data;
    });
    this.loadImage();

  }


  loadImage() {
    this.authService.getImageByName().subscribe((imageBlob: Blob) => {
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
  onSubmit() {
    this.authService.uploadImg(this.imageFile).pipe(
      switchMap((res: any) => {
        this.toast.success('Imagen subida con exito', 'Productos');
        this.authService.formDataUrl = res;
        this.authService.formDataProduct.image = this.authService.formDataUrl.url;
        return this.authService.postProduct(this.authService.formDataProduct);
      })
    ).subscribe(
      (response: any) => {
        this.toast.success('Se ha creado el producto exitosamente', 'Creación de Producto');
        this.clearPreview();
        this.resetForm();
      },
      (error) => {
        this.toast.error('Fallo la creacion de producto', 'Creacion de Producto');
      }
    );
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog-overlay', // Clase CSS personalizada
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //document.querySelector('.cdk-overlay-container')?.classList.replace('cdk-overlay-container', 'cdk-overlay-container.dialog-open');
        this.onSubmit();
      } else {
        // El usuario canceló la modificación
        //document.querySelector('.cdk-overlay-container')?.classList.add('dialog-open');
        //document.querySelector('.cdk-overlay-container')?.classList.replace('cdk-overlay-container', 'cdk-overlay-container.dialog-open');
        // Función para desactivar la clase


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
}
