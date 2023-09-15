import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {NgForm} from "@angular/forms";
import {UserModel} from "./User.Model";
import {ToastrService} from "ngx-toastr";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  error: string;


  constructor(public cookieService: CookieService, public authService: AuthService, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.username = "";
    this.password = "";
    this.error = "";
  }

  onSubmit() {
    if(!this.isUserValid(this.authService.formDataUser)) {
      this.toast.info("Por favor llene todos los campos","Formulario Incompleto");
    }else if( this.isValidEmail(this.authService.formDataUser.email))  {
      this.authService.login(this.authService.formDataUser)
        .subscribe(
          (response: any) => {
            this.authService.token = response.token;
            this.authService.isLog = true;
            const tokenString = JSON.stringify(response);
            const token = JSON.parse(tokenString);
            const expirationTimeInSeconds = 3480;
            this.cookieService.set('token', token.token, expirationTimeInSeconds);
            this.toast.success('Se ha iniciado sesión exitosamente', 'Inicio de sesión');
            this.route.navigate(['/homePage']);
            this.authService.formDataUser = new UserModel();
          },
          () => {
            this.error = 'Credenciales inválidas';
            this.toast.error('Credenciales inválidas', 'Error en el inicio de sesión');
          }
        );
    } else{
      this.toast.info("Por favor coloque su correo correctamente","Formato Incorrecto Correo");
    }
  }

  isValidEmail(email: string): boolean {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // Comprueba si el correo electrónico coincide con la expresión regular
    return emailRegex.test(email);
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.authService.formDataUser = new UserModel();
  }

  isUserValid(formDataUser: UserModel) {
    return formDataUser.email !== null && formDataUser.email !== '' && formDataUser.password !== null && formDataUser.password !== '';
  }

}
