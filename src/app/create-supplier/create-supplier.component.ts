import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SupplierModel} from "./supplier.model";

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.css']
})
export class CreateSupplierComponent {

  constructor(public authService: AuthService, private route: Router, private toast: ToastrService) {
    this.resetForm();
  }

  onSubmit() {
    if(!this.checkSupplierFields(this.authService.formDataSupplier)){
      this.toast.info("Por favor llene todos los campos","Formulario Incompleto");
    } else if(this.isValidPhone(this.authService.formDataSupplier.phoneSupplier)){
      this.toast.info("Por favor coloque un número celular válido","Formato Incorrecto");
    } else if(this.isValidEmail(this.authService.formDataSupplier.emailSupplier)){
      this.toast.info("Por favor coloque un correo válido","Formato Incorrecto Correo");
    } else{
      this.authService.postSupplier(this.authService.formDataSupplier).subscribe(
        (response: any) => {
          this.toast.success('Se ha creado el proveedor con exito', 'Creación de Proveedor');
          this.resetForm();
        },
        (error) => {
          if (error.status == 409) {
            this.toast.error(error.error, 'Creacion de Proveedor');
          } else {
            this.toast.error('Falló la creación del proveedor', 'Creación de Proveedor');
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

  resetForm() {
    this.authService.formDataSupplier = new SupplierModel();
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
}
