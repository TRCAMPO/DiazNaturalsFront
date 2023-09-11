import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from "@angular/material/dialog";
import {SupplierModel} from "../create-supplier/supplier.model";
import {ConfirmDialogEditSupplierComponent} from "../confirm-dialog-edit-supplier/confirm-dialog-edit-supplier.component";


@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css']
})
export class EditSupplierComponent {

  constructor(public dialog: MatDialog, public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.authService.formDataSupplier = new SupplierModel();
    this.authService.formDataSearchSupplier.search = "";
  }

  onSubmit() {
    this.authService.formDataSupplier.phoneSupplier = this.authService.formDataSupplier.phoneSupplier + "";
    this.authService.putSupplier(this.authService.formDataSupplier).subscribe(
      response => {
        this.toast.success("Proveedor modificado correctamente", "Proveedor Modificado");
        this. resetForm();
      },
      error => {
        if (error.status == 409){
          this.toast.error(error.error, 'Modificación de Proveedor');
        }else {
          this.toast.error("Surgió un problema en la modificación", "Proveedor no Modificado");
        }
      }
    );
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogEditSupplierComponent, {
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

  searchEditSupplier() {
    this.authService.formDataSupplier = new SupplierModel();
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
