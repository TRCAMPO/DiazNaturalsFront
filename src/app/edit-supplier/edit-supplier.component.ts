import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {SupplierModel} from "../create-supplier/supplier.model";
import {ConfirmDialogEditSupplierComponent} from "../confirm-dialog-edit-supplier/confirm-dialog-edit-supplier.component";


@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css', './edit-supplier2.component.css']
})
export class EditSupplierComponent {

  constructor(public dialog: MatDialog, public authService: AuthService, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.authService.formDataSupplier = new SupplierModel();
    this.authService.formDataSearchSupplier.search = "";
  }

  onSubmit() {
    this.authService.formDataSupplier.phoneSupplier = this.authService.formDataSupplier.phoneSupplier+"";
    if(!this.checkSupplierFields(this.authService.formDataSupplier)){
      this.toast.info("Por favor llene todos los campos","Formulario Incompleto");
    } else if(this.isValidPhone(this.authService.formDataSupplier.phoneSupplier)){
      this.toast.info("Por favor coloque un número celular válido","Formato Incorrecto");
    } else if(this.isValidEmail(this.authService.formDataSupplier.emailSupplier)){
      this.toast.info("Por favor coloque un correo válido","Formato Incorrecto Correo");
    } else {
      this.authService.formDataSupplier.phoneSupplier = this.authService.formDataSupplier.phoneSupplier + "";
      this.authService.putSupplier(this.authService.formDataSupplier).subscribe(
        () => {
          this.toast.success("Proveedor modificado correctamente", "Proveedor Modificado");
          this.resetForm();
        },
        error => {
          if (error.status == 409) {
            this.toast.error(error.error, 'Modificación de Proveedor');
          } else {
            this.toast.error("Surgió un problema en la modificación", "Proveedor no Modificado");
          }
        }
      );
    }
  }

  isValidEmail(email: string): boolean {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // Comprueba si el correo electrónico coincide con la expresión regular
    return emailRegex.test(email);
  }

  limitDigits(event: any) {
    const maxLength = 10;
    const inputValue = event.target.value;
    if (inputValue.length > maxLength) {
      event.target.value = inputValue.slice(0, maxLength);
      this.authService.formDataUserClient.phoneClient = event.target.value;
    }
  }

  isValidPhone(phone: string): boolean {
    return phone.length === 10;
  }

  private checkSupplierFields(formDataProduct: SupplierModel) {
    if(formDataProduct.addressSupplier !== "" &&
      formDataProduct.addressSupplier !== null &&
      formDataProduct.emailSupplier !== "" &&
      formDataProduct.emailSupplier !== null &&
      formDataProduct.phoneSupplier !== "" &&
      formDataProduct.phoneSupplier !== null &&
      formDataProduct.nameSupplier !== "" &&
      formDataProduct.nameSupplier !== null &&
      formDataProduct.nitSupplier !== "" &&
      formDataProduct.nitSupplier !== null ){
      return true;
    }
    return false;
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
        () => {
          this.toast.error("No se pudo encontrar el proveedor", "Error en la Búsqueda");
        }
      );
    } else {
      this.toast.info("No ha ingresado el proveedor", "Ingrese el Proveedor");
    }
  }
}
