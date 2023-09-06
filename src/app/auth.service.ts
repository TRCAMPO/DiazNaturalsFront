import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserModel} from "./login/User.Model";
import {PasswordModel} from "./new-password/Password.Model";
import {emailModel} from "./recover-account/EmailModel";
import {CodeModel} from "./recover-account/CodeModel";
import {SendPasswordModel} from "./new-password/SendPassword.Model";
import {ProductModel} from "./create-product/product.model";
import {CategoryModel} from "./create-product/category.model";
import {PresentationsModel} from "./create-product/presentation.model";
import {SuppliersModel} from "./create-product/suppliers.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7167/api';

  formDataUser: UserModel = new UserModel();
  formPassword: PasswordModel = new PasswordModel();
  formEmail: emailModel = new emailModel();
  formCode: CodeModel = new CodeModel();
  formSendPassword: SendPasswordModel = new SendPasswordModel();
  formDataProduct: ProductModel = new ProductModel();
  token: string = "";
  isLog: boolean = false;
  constructor(private http: HttpClient) {}

  login(user: UserModel) {
    return this.http.post(`${this.apiUrl}/AccesControll/Validar`, user);
  }

  isLoggedIn() {
    return this.isLog;
  }

  sendCodigo(email: emailModel) {
    return this.http.post(`${this.apiUrl}/AccesControll/SendEmail`, email);
  }

  validateCodigo(code: CodeModel) {
    return this.http.post(`${this.apiUrl}/AccesControll/ValidarCode`, code);
  }

  changePassword(password: SendPasswordModel) {
    return this.http.post(`${this.apiUrl}/AccesControll/EditarContraseña`, password);
  }

  getCategories() {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/`);
  }

  getPresentation() {
    return this.http.get<PresentationsModel[]>(`${this.apiUrl}/`);
  }

  getSuppliers() {
    return this.http.get<SuppliersModel[]>(`${this.apiUrl}/`);
  }

  postProduct(formDataProduct: ProductModel) {
    return this.http.post(`${this.apiUrl}/`, formDataProduct);
  }

  uploadImg(imageFile: File|null) {
    const formData = new FormData();
    const newFileName = this.formDataProduct.name + ".jpg";
    // @ts-ignore
    formData.append('file', imageFile, newFileName);
    return this.http.post<string>(this.apiUrl+'/', formData);
  }

  getProductById(number: number) {
    return this.http.get<ProductModel>(`${this.apiUrl}/`);
  }
}
