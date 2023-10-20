import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {SharedDataServiceProduct} from "./sharedDataServiceProduct";
import {
  ConfirmDialogComponentDeleteProduct
} from "../confirm-dialog-delete-product/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UserModelClient} from "../create-user/userClient.model";
import {AllProductsModel} from "../catalog/AllProductsModel";

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit{
  products: AllProductsModel[] = [];
  productsOrigin: AllProductsModel[] = [];
  currentPage = 1;
  elementeForPage = 5;
  constructor(public dialog: MatDialog, private toast: ToastrService, public authService: AuthService, public router: Router, private sharedDataService: SharedDataServiceProduct)  {

  }
  ngOnInit() {
    this.authService.getAllProductsActive().subscribe(
      (data) => {
        this.products = data;
        this.productsOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar usuarios", "Error en la Búsqueda");
      }
    );
  }

  deleteproduct(nameUser: string){
    this.authService.getUserByName(nameUser).subscribe(
      (data) => {
        this.authService.formDataUserClient = data;
      },
      (error) => {
      }
    );
    this.openConfirmationDialog();
  }

  editproduct(nameSupplier: string){
    const productData = nameSupplier;
    // Utiliza el servicio para establecer los datos
    this.sharedDataService.setProductData(productData);
    // Navega a la pantalla de editar producto
    this.router.navigate(['/editUser']);
  }

  searchEditUser() {
    this.authService.formDataUserClient = new UserModelClient();
    this.products = this.productsOrigin;
    if (this.authService.formDataSearchUser.search) {
      this.products = this.products.filter(user =>
        user.name.toLowerCase().includes(this.authService.formDataSearchUser.search.toLowerCase())
      );
    } else {
      this.authService.getAllProductsActive().subscribe(
        (data) => {
          this.products = data;
        },
        () => {
          this.toast.error("No se pudieron encontrar usuarios", "Error en la Búsqueda");
        }
      );
    }
  }

  onSubmit() {
    this.authService.formDataUserClientDelete.nitClient = this.authService.formDataUserClient.nitClient;
    this.authService.formDataUserClientDelete.isActive = false;
    this.authService.patchUser(this.authService.formDataUserClientDelete).subscribe(
      response => {
        this.toast.success("Usuario eliminado correctamente", "Usuario Eliminado");
        this.resetForm();
      },
      error => {
        this.toast.error("Surgio un problema en la eliminación", "Usuario no Eliminado");
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
    this.authService.formDataUserClient = new UserModelClient();
    this.authService.getAllProductsActive().subscribe(
      (data) => {
        this.products = data;
        this.productsOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar usuarios", "Error en la Búsqueda");
      }
    );
  }

}

