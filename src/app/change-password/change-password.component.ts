import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {NgForm} from "@angular/forms";
import {PasswordModel} from "../new-password/Password.Model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  password: string;
  error: string;
  confirmacion: string;


  constructor(public authService: AuthService, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.password = "";
    this.error = "";
    this.confirmacion = "";
  }

  onSubmit() {
    if(this.authService.formPassword.password !== null && this.authService.formPassword.confirmation !== '' &&
      this.authService.formPassword.password !== '' && this.authService.formPassword.confirmation !== null) {
      if (this.authService.formPassword.password == this.authService.formPassword.confirmation) {
        this.authService.formSendPassword.password = this.authService.formPassword.password;
        this.authService.formSendPassword.email = this.dataService.getInputValue();
        this.authService.changePassword(this.authService.formSendPassword)
          .subscribe(
            () => {
              this.toast.success("Se cambio con exito la contraseña", "Cambio de contraseña");
              this.authService.formPassword = new PasswordModel();
              if (this.dataService.getInputValue2() === 'admin') {
                this.route.navigate(['/homePage']);
              }else {
                this.route.navigate(['/homePageUser']);
              }
            },
            () => {
              this.error = 'error';
              this.toast.error("Intente nuevamente", "Error en el cambio de contraseña");
              this.authService.formPassword = new PasswordModel();
            }
          );
      } else {
        console.error('Las contraseñas no coinciden');
        this.toast.error("Intente nuevamente", "Las contraseñas no coinciden");
        this.authService.formPassword = new PasswordModel();
      }
    }else {
      this.toast.info("Por favor llene todos los campos","Formulario Incompleto");
    }
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.authService.formPassword = new PasswordModel();
  }
}
