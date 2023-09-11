import { Component, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from "@angular/material/dialog";
import {SupplierModel} from "../create-supplier/supplier.model";
import {ConfirmDialogDeleteSupplierComponent} from "../confirm-dialog-delete-supplier/confirm-dialog-delete-supplier.component";

@Component({
  selector: 'app-delete-supplier',
  templateUrl: './delete-supplier.component.html',
  styleUrls: ['./delete-supplier.component.css']
})
export class DeleteSupplierComponent {

  constructor(public dialog: MatDialog, public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.authService.formDataSupplier = new SupplierModel();
    this.authService.formDataSearchSupplier.search = "";
  }

  onSubmit() {
    this.authService.formDataDeleteSupplier.nitSupplier = this.authService.formDataSupplier.nitSupplier;
    this.authService.formDataDeleteSupplier.isActive = false;
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
    this.changePage();
  }

  changePage() {
    this.route.navigate(['/homePage']);
  }

  searchDeleteSupplier() {
    if(this.authService.formDataSearchSupplier.search !== '' && this.authService.formDataSearchSupplier.search !== null) {
      this.authService.getSupplierByName(this.authService.formDataSearchSupplier.search).subscribe(
        (data) => {
          this.authService.formDataSupplier = data;
          // @ts-ignore
          this.toast.success("Se encontró el proveedor", "Proveedor Encontrado")
        },
        (error) => {
          this.toast.error("No se pudo encontrar el proveedor", "Error en la Búsqueda");
        }
      );
    } else {
      this.toast.info("No ha ingresado el proveedor", "Ingrese el Proveedor");
    }
  }
}
