import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {SharedDataServiceProducts} from "./shareDataServiceProducts";
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

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit{
  products: AllProductsModel[] = [];
  productsOrigin: AllProductsModel[] = [];
  categories: CategoryModel[] = [];
  presentations: PresentationsModel[] = []
  suppliers: SuppliersModel[] = [];
  // @ts-ignore
  private blob: Blob;
  currentPage = 1;
  elementeForPage = 5;
  constructor(public dialog: MatDialog, private toast: ToastrService, public authService: AuthService, public router: Router, private sharedDataService: SharedDataServiceProducts)  {

  }
  ngOnInit() {
    this.authService.getAllProductsActive().subscribe((response) => {
      this.products = response;
      this.productsOrigin = response;
      this.products.forEach(imgProduct => {
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

  deleteproduct(name: string, presentation: string, supplier: string){
    const product: SearchProductModel = new SearchProductModel();
    product.search = name;
    product.presentation = presentation;
    product.suppliers = supplier;
    this.authService.getProductByNamePresentationSupplier(product).subscribe(
      (data) => {
        this.authService.formDataProduct = data;
      },
      (error) => {
      }
    );
    this.openConfirmationDialog();
  }

  editproduct(name: string, presentation: string, supplier: string){
    const product: SearchProductModel = new SearchProductModel();
    product.search = name;
    product.presentation = presentation;
    product.suppliers = supplier;
    // Utiliza el servicio para establecer los datos
    this.sharedDataService.setProductData(product);
    // Navega a la pantalla de editar producto
    this.router.navigate(['/editProduct']);
  }

  searchProduct() {
    this.authService.formDataUserClient = new UserModelClient();
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

    if (this.authService.formDataSearchProduct.search) {
      // Filtrar por búsqueda de texto
      this.products = this.products.filter(product =>
        product.name.toLowerCase().includes(this.authService.formDataSearchProduct.search.toLowerCase())
      );
    } else if(this.authService.formDataSearchProduct.search && this.authService.formDataSearchProduct.presentation && this.authService.formDataSearchProduct.suppliers){
      // Obtener todos los productos activos si no hay búsqueda de texto
      this.authService.getAllProductsActive().subscribe(
        (data) => {
          this.products = data;
        },
        () => {
          this.toast.error("No se pudieron encontrar productos", "Error en la Búsqueda");
        }
      );
    }
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
    this.authService.getAllProductsActive().subscribe(
      (data) => {
        this.products = data;
        this.productsOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar productos", "Error en la Búsqueda");
      }
    );
  }

}

