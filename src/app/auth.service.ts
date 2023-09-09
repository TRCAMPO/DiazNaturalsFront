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
import {Observable} from "rxjs";
import {UrlModel} from "./create-product/url.model";
import {SearchModel} from "./confirm-dialog-delete-product/search.model";
import {DeleteProductModel} from "./delete-product/DeleteProduct.model";

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
  formDataUrl: UrlModel = new UrlModel();
  token: string = "";
  isLog: boolean = false;
  formDataSearch: SearchModel = new SearchModel();
  formDataDelete: DeleteProductModel = new DeleteProductModel();
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
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/Categories`);
  }

  getPresentation() {
    return this.http.get<PresentationsModel[]>(`${this.apiUrl}/Presentations`);
  }

  getSuppliers() {
    return this.http.get<SuppliersModel[]>(`${this.apiUrl}/Suppliers`);
  }

  postProduct(formDataProduct: ProductModel) {
    return this.http.post(`${this.apiUrl}/Products`, formDataProduct);
  }

  uploadImg(imageFile: File|null) {
    const formData = new FormData();
    const newFileName = this.formDataProduct.name + ".jpg";
    // @ts-ignore
    formData.append('file', imageFile, newFileName);
    return this.http.post<string>('https://localhost:7167/load', formData);
  }

  getProductById(number1: number) {
    return this.http.get<ProductModel>(`${this.apiUrl}/Products/${number1}`);
  }

  getImageByName(name:string): Observable<Blob> {
    return this.http.get(`https://localhost:7167/${name}`, { responseType: 'blob' });
  }

  putProduct(formDataProduct: ProductModel) {
    return this.http.put(`${this.apiUrl}/Products/${formDataProduct.name}`, formDataProduct);
  }

  patchProduct(formDataProduct: DeleteProductModel) {
    return this.http.patch(`${this.apiUrl}/Suppliers/EditState`,formDataProduct);
  }


  getProductByNameCategorySupplier(formDataSearchSend: SearchModel) {
    return this.http.get<ProductModel>(`${this.apiUrl}/Products/${formDataSearchSend}`);
  }
}
