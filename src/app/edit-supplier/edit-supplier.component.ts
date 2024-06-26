import {Component, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {SupplierModel} from "../create-supplier/supplier.model";
import {ConfirmDialogEditSupplierComponent} from "../confirm-dialog-edit-supplier/confirm-dialog-edit-supplier.component";
import {SupplierSearchModel} from "./supplierSearch.model";
import {SharedDataService} from "../list-suppliers/shareDataService";


@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css', './edit-supplier2.component.css']
})
export class EditSupplierComponent implements OnInit{
  backgroundColor: string = "rgba(0, 0, 0, 0.12)";
  disabledInput: boolean = true;
  constructor(private sharedDataService: SharedDataService, public dialog: MatDialog, public authService: AuthService, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.authService.formDataSupplier = new SupplierModel();
    this.authService.formDataSearchSupplier = new SupplierSearchModel();
  }

  ngOnInit() {
    this.sharedDataService.currentProductData.subscribe(data => {
      // Verifica si data tiene algún valor antes de asignarlo
      if (data) {
        this.authService.formDataSearchSupplier.search = data;
        this.searchEditSupplier2();
      }
    });
    this.sharedDataService.clearProductData();
  }

  activateCamp() {
    this.disabledInput = false;
  }

  onSubmit() {
    if(this.checkSupplierPhone(this.authService.formDataSupplier)){
      this.toast.info("Por favor coloque un número celular válido","Formato Incorrecto");
    } else if(!this.checkSupplierFields(this.authService.formDataSupplier)){
      this.toast.info("Por favor llene todos los campos","Formulario Incompleto");
    } else if(!this.isValidNit(this.authService.formDataSupplier.nitSupplier)){
      this.toast.info("Por favor ingrese un nit de mas de 5 digitos","Formato Incorrecto");
    }else if(!this.isValidPhone(this.authService.formDataSupplier.phoneSupplier)){
      this.toast.info("Por favor coloque un número celular válido","Formato Incorrecto");
    } else if(!this.isValidEmail(this.authService.formDataSupplier.emailSupplier)){
      this.toast.info("Por favor coloque un correo válido","Formato Incorrecto Correo");
    } else {
      this.authService.formDataSupplier.phoneSupplier = this.authService.formDataSupplier.phoneSupplier+"";
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

  cangeColor() {
    this.backgroundColor = "#f5f6f7";
  }

  isValidNit(nit: string): boolean {
    return nit.length >= 5;
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
      this.authService.formDataSupplier.phoneSupplier = event.target.value;
    }
  }

  isValidPhone(phone: string|number): boolean {
    phone = phone+"";
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

  checkSupplierPhone(formDataProduct: SupplierModel) {
    if(formDataProduct.addressSupplier !== "" &&
      formDataProduct.addressSupplier !== null &&
      formDataProduct.emailSupplier !== "" &&
      formDataProduct.emailSupplier !== null &&
      formDataProduct.phoneSupplier !== "" &&
      formDataProduct.phoneSupplier == null &&
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
          this.activateCamp();
          this.toast.success("Se encontró el proveedor", "Proveedor Encontrado");
          this.cangeColor();
        },
        () => {
          this.toast.error("No se pudo encontrar el proveedor", "Error en la Búsqueda");
        }
      );
    } else {
      this.toast.info("No ha ingresado el proveedor", "Ingrese el Proveedor");
    }
  }

  searchEditSupplier2() {
    this.authService.formDataSupplier = new SupplierModel();
    if(this.authService.formDataSearchSupplier.search !== '' && this.authService.formDataSearchSupplier.search !== null) {
      this.authService.getSupplierByName(this.authService.formDataSearchSupplier.search).subscribe(
        (data) => {
          this.authService.formDataSupplier = data;
          // @ts-ignore
          this.activateCamp();
          this.cangeColor();
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
