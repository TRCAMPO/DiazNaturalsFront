import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {NgForm} from "@angular/forms";
import {UserModel} from "./User.Model";

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


  constructor(public authService: AuthService, private route: Router, public dataService : DataService) {
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
          console.log('Inicio de sesión exitoso');
          this.route.navigate(['/menu']);
        },
        (error) => {
          this.error = 'Credenciales inválidas';
          console.error('Error en el inicio de sesión', error);
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
