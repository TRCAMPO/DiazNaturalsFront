import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {NgForm} from "@angular/forms";
import {UserModel} from "./User.Model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  inputValue: string = '';
  username: string;
  password: string;
  error: string;


  constructor(public authService: AuthService, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.username = "";
    this.password = "";
    this.error = "";

  }

  onSubmit() {
    this.authService.login(this.authService.formDataUser)
      .subscribe(
        (response: any) => {
          this.authService.token = response.token;
          this.authService.isLog = true;
          this.toast.success('Se ha iniciado sesión exitosamente', 'Inicio de sesión');
          this.route.navigate(['/homePage']);
          this.authService.formDataUser = new UserModel();
        },
        (error) => {
          this.error = 'Credenciales inválidas';
          this.toast.error('Credenciales inválidas', 'Error en el inicio de sesión');
        }
      );


  }

  updateInputValue() {
    this.dataService.setInputValue(this.inputValue);
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.authService.formDataUser = new UserModel();
  }

}
