import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth.service";
import {SupplierModel} from "../create-supplier/supplier.model";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {SharedDataService} from "./shareDataService";
import {
  ConfirmDialogDeleteSupplierComponent
} from "../confirm-dialog-delete-supplier/confirm-dialog-delete-supplier.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.css']
})
export class ListSuppliersComponent implements OnInit{
  @Input() cartStyles: any;
  suppliers: SupplierModel[] = [];
  suppliersOrigin: SupplierModel[] = [];
  currentPage = 1;
  elementeForPage = 5;
  constructor(public dialog: MatDialog, private toast: ToastrService, public authService: AuthService, public router: Router, private sharedDataService: SharedDataService)  {

  }
  ngOnInit() {
    this.authService.getSuppliers().subscribe(
      (data) => {
        this.suppliers = data;
        this.suppliersOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar proveedores", "Error en la Búsqueda");
      }
    );
  }

  deleteproduct(nameSupplier: string){
    this.authService.getSupplierByName(nameSupplier).subscribe(
      (data) => {
        this.authService.formDataSupplier = data;
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
    this.router.navigate(['/editSupplier']);
  }

  searchEditSupplier() {
    this.authService.formDataSupplier = new SupplierModel();
    this.suppliers = this.suppliersOrigin;
    if (this.authService.formDataSearchSupplier.search) {
      this.suppliers = this.suppliers.filter(supplier =>
        supplier.nameSupplier.toLowerCase().includes(this.authService.formDataSearchSupplier.search.toLowerCase()) ||
        supplier.nitSupplier.toString().includes(this.authService.formDataSearchSupplier.search)
      );
    } else {
      this.authService.getSuppliers().subscribe(
        (data) => {
          this.suppliers = data;
        },
        () => {
          this.toast.error("No se pudieron encontrar proveedores", "Error en la Búsqueda");
        }
      );
    }
  }

  onSubmit() {
    this.authService.formDataDeleteSupplier.nitSupplier = this.authService.formDataSupplier.nitSupplier;
    this.authService.formDataDeleteSupplier.isActive = false;
    this.authService.formDataSupplier.phoneSupplier = this.authService.formDataSupplier.phoneSupplier+"";
    this.authService.patchSupplier(this.authService.formDataDeleteSupplier).subscribe(
      response => {
        this.toast.success("Proveedor eliminado correctamente", "Proveedor Eliminado");
        this.resetForm();
      },
      error => {
        this.toast.error("Surgio un problema en la eliminación", "Usuario no Eliminado");
      }
    );
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogDeleteSupplierComponent, {
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
    this.authService.formDataSupplier = new SupplierModel();
    this.authService.getSuppliers().subscribe(
      (data) => {
        this.suppliers = data;
        this.suppliersOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar proveedores", "Error en la Búsqueda");
      }
    );
  }

}

