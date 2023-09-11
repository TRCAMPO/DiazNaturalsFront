import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
import {SearchProductModel} from "./confirm-dialog-delete-product/searchProductModel";
import {DeleteProductModel} from "./delete-product/DeleteProduct.model";
import {StateModel} from "./create-user/state.model";
import {CytiModel} from "./create-user/city.model";
import {UserModelClient} from "./create-user/userClient.model";
import {UserSearchModel} from "./edit-user/userSearch.model";
import {UserDeleteModelClient} from "./delete-user/userDelete.model";

import {SupplierModel} from "./create-supplier/supplier.model";
import {DeleteSupplierModel} from "./delete-supplier/DeleteSupplier.model";
import {SupplierSearchModel} from "./edit-supplier/supplierSearch.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://www.DiazNaturls.somee.com/api';

  formDataUser: UserModel = new UserModel();
  formPassword: PasswordModel = new PasswordModel();
  formEmail: emailModel = new emailModel();
  formCode: CodeModel = new CodeModel();
  formSendPassword: SendPasswordModel = new SendPasswordModel();
  formDataProduct: ProductModel = new ProductModel();
  formDataUrl: UrlModel = new UrlModel();
  token: string|null = localStorage.getItem('jwtToken');
  isLog: boolean = false;
  formDataSearchProduct: SearchProductModel = new SearchProductModel();
  formDataDelete: DeleteProductModel = new DeleteProductModel();
  formDataStates: StateModel = new StateModel();
  formDataCitys: CytiModel = new CytiModel();
  formDataUserClient: UserModelClient = new UserModelClient();
  formDataSearchUser: UserSearchModel = new UserSearchModel();
  formDataUserClientDelete: UserDeleteModelClient = new UserDeleteModelClient();

  formDataSupplier: SupplierModel = new SupplierModel();
  formDataDeleteSupplier: DeleteSupplierModel = new DeleteSupplierModel();
  formDataSearchSupplier: SupplierSearchModel = new SupplierSearchModel();

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
    return this.http.put(`${this.apiUrl}/AccesControll/EditarContrasena`, password);
  }

  getCategories() {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/Categories`);
  }

  getPresentation() {
    return this.http.get<PresentationsModel[]>(`${this.apiUrl}/Presentations`);
  }

  getSuppliers() {
    return this.http.get<SuppliersModel[]>(`${this.apiUrl}/Suppliers/all`);
  }

  postProduct(formDataProduct: ProductModel) {
    return this.http.post(`${this.apiUrl}/Products`, formDataProduct);
  }

  uploadImg(imageFile: File|null) {
    const formData = new FormData();
    const newFileName = this.formDataProduct.name+"_"+this.formDataProduct.supplier +"_"+ this.formDataProduct.presentation+ ".jpg";
    // @ts-ignore
    formData.append('file', imageFile, newFileName);
    return this.http.post<string>(`${this.apiUrl}/Blob/load`, formData);
  }

  getProductById(number1: number) {
    return this.http.get<ProductModel>(`${this.apiUrl}/Products/${number1}`);
  }

  getImageByName(name:string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Blob/${name}`, { responseType: 'blob' });
  }

  putProduct(formDataProduct: ProductModel) {
    return this.http.put(`${this.apiUrl}/Products/${formDataProduct.idProduct}`, formDataProduct);
  }

  patchProduct(formDataProduct: DeleteProductModel) {
    return this.http.patch(`${this.apiUrl}/Products/EditState?id=${formDataProduct.idProduct}`,formDataProduct);
  }
  getProductByNameCategorySupplier(formDataSearchSend: SearchProductModel) {
    return this.http.get<ProductModel>(`${this.apiUrl}/Products/search?search=${formDataSearchSend.search}&suppliers=${formDataSearchSend.suppliers}&presentation=${formDataSearchSend.presentation}`);
  }

  getStates() {
    return this.http.get<StateModel[]>(`https://api-colombia.com/api/v1/Department`);
  }
  getCitys(){
    return this.http.get<CytiModel[]>(`https://api-colombia.com/api/v1/City`);
  }

  postUser(formDataUserClient: UserModelClient) {
    return this.http.post(`${this.apiUrl}/Clients`, formDataUserClient);
  }

  getUserByName(search: string) {
    return this.http.get<UserModelClient>(`${this.apiUrl}/Clients/search?search=${search}`);
  }

  putUser(formDataUserClient: UserModelClient) {
    return this.http.put(`${this.apiUrl}/Clients/${formDataUserClient.nitClient}`, formDataUserClient);
  }

  patchUser(formDataDeleteUser: UserDeleteModelClient) {
    return this.http.patch(`${this.apiUrl}/Clients/EditState`,formDataDeleteUser);
  }

  postSupplier(formDataSupplier: SupplierModel) {
    return this.http.post(`${this.apiUrl}/Suppliers`, formDataSupplier);
  }

  getSupplierByName(search: string) {
    return this.http.get<SupplierModel>(`${this.apiUrl}/Suppliers/search?search=${search}`);
  }

  putSupplier(formDataSupplier: SupplierModel) {
    return this.http.put(`${this.apiUrl}/Clients/${formDataSupplier.nitSupplier}`, formDataSupplier);
  }

  patchSupplier(formDataDeleteSupplier: DeleteSupplierModel) {
    return this.http.patch(`${this.apiUrl}/Suppliers/EditState`, formDataDeleteSupplier);
  }

}
