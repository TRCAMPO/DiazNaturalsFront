import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserModel} from "./login/User.Model";
import {PasswordModel} from "./nueva-contrasena/Password.Model";
import {CorreoModel} from "./recuperar-cuenta/Correo.Model";
import {CodigoModel} from "./recuperar-cuenta/Codigo.Model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '';

  formDataUser: UserModel = new UserModel();
  formPassword: PasswordModel = new PasswordModel();
  formCorreo: CorreoModel = new CorreoModel();
  formCodigo: CodigoModel = new CodigoModel();
  token: string = "";
  isLog: boolean = false;
  constructor(private http: HttpClient) {}

  login(user: UserModel) {
    return this.http.post(`${this.apiUrl}/`, user);
  }

  isLoggedIn() {
    return this.isLog;
  }

  sendCodigo(correo: CorreoModel) {
    return this.http.post(`${this.apiUrl}/`, correo);
  }

  validateCodigo(codigo: CodigoModel) {
    return this.http.post(`${this.apiUrl}/`, codigo);
  }

  changePassword(password: PasswordModel) {
    return this.http.post(`${this.apiUrl}/`, password);
  }
}
