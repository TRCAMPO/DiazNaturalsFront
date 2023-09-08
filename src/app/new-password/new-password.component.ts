import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {NgForm} from "@angular/forms";
import {PasswordModel} from "./Password.Model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent {
  inputValue: string = '';
  password: string;
  error: string;
  confirmacion: string;


  constructor(public authService: AuthService, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.password = "";
    this.error = "";
    this.confirmacion = "";
  }

  onSubmit() {
    if (this.authService.formPassword.password == this.authService.formPassword.confirmation) {
      this.authService.formSendPassword.password = this.authService.formPassword.password;
      this.authService.formSendPassword.email = this.dataService.getInputValue();
      this.authService.changePassword(this.authService.formSendPassword)
        .subscribe(
          (response: any) => {
            this.toast.success("Se cambio con exito la contraseña","Cambio de contraseña");
            this.route.navigate(['/homePage']);
          },
          (error) => {
            this.error = 'error';
            this.toast.error("Intente nuevamente","Error en el cambio de contraseña");
          }
        );
    }else{
      console.error('Las contraseñas no coinciden');
      this.toast.error("Intente nuevamente","Las contraseñas no coinciden");
      this.authService.formPassword = new PasswordModel();
    }
  }

  updateInputValue() {
    this.dataService.setInputValue(this.inputValue);
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.authService.formPassword = new PasswordModel();
  }
}
