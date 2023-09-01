import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserModel} from "./login/User.Model";
import {PasswordModel} from "./nueva-contrasena/Password.Model";
import {CorreoModel} from "./recuperar-cuenta/Correo.Model";
import {CodigoModel} from "./recuperar-cuenta/Codigo.Model";
import {SendPasswordModel} from "./nueva-contrasena/SendPassword.Model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7167/api';

  formDataUser: UserModel = new UserModel();
  formPassword: PasswordModel = new PasswordModel();
  formCorreo: CorreoModel = new CorreoModel();
  formCodigo: CodigoModel = new CodigoModel();
  formSendPassword: SendPasswordModel = new SendPasswordModel();
  token: string = "";
  isLog: boolean = false;
  constructor(private http: HttpClient) {}

  login(user: UserModel) {
    return this.http.post(`${this.apiUrl}/AccesControll/Validar`, user);
  }

  isLoggedIn() {
    return this.isLog;
  }

  sendCodigo(correo: CorreoModel) {
    return this.http.post(`${this.apiUrl}/AccesControll/SendEmail`, correo);
  }

  validateCodigo(codigo: CodigoModel) {
    return this.http.post(`${this.apiUrl}/AccesControll/ValidarCode`, codigo);
  }

  changePassword(password: SendPasswordModel) {
    return this.http.post(`${this.apiUrl}/AccesControll/EditarContraseña`, password);
  }
}
