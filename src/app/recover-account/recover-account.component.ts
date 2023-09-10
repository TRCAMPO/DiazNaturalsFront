import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {NgForm} from "@angular/forms";
import {CodeModel} from "./CodeModel";
import {emailModel} from "./EmailModel";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.component.html',
  styleUrls: ['./recover-account.component.css']
})
export class RecoverAccountComponent {
  inputValue: string = '';
  username: string;
  password: string;
  error: string;
  codigo: string;


  constructor(public authService: AuthService, private route: Router, private dataService : DataService, private toast:ToastrService) {
    this.username = "";
    this.password = "";
    this.error = "";
    this.codigo = "";
  }

  onSubmitOne() {
    if(!this.isValidEmail(this.authService.formEmail.email)) {
      this.toast.info("Por favor coloque un correo válido","Correo Incorrecto");
    } else {
      this.authService.sendCodigo(this.authService.formEmail)
        .subscribe(
          (response: any) => {
            this.toast.success("Revise su correo", "Codigo enviado correctamente");
            this.dataService.setInputValue(this.authService.formEmail.email);
          },
          (error) => {
            this.error = 'Correo Invalido';
            this.toast.error("Intente nuevamente", "Codigo no enviado");
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

  onSubmit() {
    if(this.authService.formCode.code !== null && this.authService.formCode.code !== '') {
      this.authService.formCode.email = this.dataService.getInputValue();
      this.authService.validateCodigo(this.authService.formCode)
        .subscribe(
          (response: any) => {
            this.toast.success("", "Codigo valido");
            this.route.navigate(['/newPassword']);
          },
          (error) => {
            this.error = 'Codigo Invalido';
            this.toast.error("Intente nuevamente o solicite otro", "Codigo invalido");
          }
        );
    }else{
      this.toast.info("Por favor ingrese el codigo que se envio a su correo o solicite otro","Ingrese el codigo");
    }
  }

  updateInputValue() {
    this.dataService.setInputValue(this.inputValue);
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.authService.formCode = new CodeModel();
    this.authService.formEmail = new emailModel();
  }
}
