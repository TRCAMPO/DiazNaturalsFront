import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserModel} from "./login/User.Model";
import {PasswordModel} from "./new-password/Password.Model";
import {emailModel} from "./recover-account/EmailModel";
import {CodeModel} from "./recover-account/CodeModel";
import {SendPasswordModel} from "./new-password/SendPassword.Model";
import {ProductModel} from "./create-product/product.model";
import {AllProductsModel} from "./catalog/AllProductsModel";
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
import {CookieService} from "ngx-cookie-service";
import {OrdersModel} from "./list-orders/ordersModel";
import {OrderSearchModel} from "./list-orders/OrderSearchModel";
import {StatusModel} from "./list-orders/status.model";
import {ImageUserModel} from "./validate-payment-user/ImageUser.model";
import {OrdersModelNew} from "./cart/OrdersModelNew";
import {OrderHistory} from "./validate-payment/OrderHistoryModel";
import {ValidateQuantity} from "./validate-payment/ValidateQuantity";
import {NameLogs} from "./list-logs/NameLogs";
import {NotificationsModel} from "./notifications/notifications.model";
import {ProgressModel} from "./validate-payment-user/progress.model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = 'https://www.DiazNaturals.somee.com/api';
  //private apiUrl = 'https://localhost:7167/api';

  private sessionStartTime: number = 0;

  formDataUser: UserModel = new UserModel();
  formPassword: PasswordModel = new PasswordModel();
  formEmail: emailModel = new emailModel();
  formCode: CodeModel = new CodeModel();
  formSendPassword: SendPasswordModel = new SendPasswordModel();
  formDataProduct: ProductModel = new ProductModel();
  formDataAllProducts: AllProductsModel = new AllProductsModel();
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
  formDataSearchOrder: OrderSearchModel = new OrderSearchModel();
  formDataOrder: OrdersModel = new OrdersModel();
  formDataOrderHistory: OrderHistory = new OrderHistory();
  formSearchProduct: ProductModel = new ProductModel();
  // @ts-ignore
  formDataAmount: number| null;
  formDataNotifications: NotificationsModel = new NotificationsModel();


  constructor(private http: HttpClient, public cookiesService: CookieService) {
    this.startSession();
  }

  login(user: UserModel) {
    return this.http.post(`${this.apiUrl}/AccesControll/Validar`, user);
  }

  startSession() {
    this.sessionStartTime = Date.now(); // Registra la hora de inicio
    const currentTime = new Date().getTime();
    const sessionDurationInMilliseconds = 58 * 60 * 1000; // 58 minutos en milisegundos
    const emailUser=this.cookiesService.get('email');
    const time={
      currentTime: currentTime,
      emailUser: emailUser,
    };
    const timeJSON = JSON.stringify(time);
    localStorage.setItem('time', timeJSON);
    setTimeout(() => {
      this.endSession(); // Finaliza la sesión después de 58 minutos
    }, sessionDurationInMilliseconds);
  }

  // Finaliza la sesión y borra el contenido del almacenamiento local
  endSession(){
    localStorage.clear(); // Borra todo el contenido del almacenamiento local
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
    return this.http.get<SuppliersModel[]>(`${this.apiUrl}/Suppliers/active`);
  }

  getSuppliersAll() {
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

  uploadImgPayment(imageFile: File|null, name:string, idOrden:number) {
    const formData = new FormData();
    const newFileName = name+"_"+idOrden+ ".jpg";
    // @ts-ignore
    formData.append('file', imageFile, newFileName);
    return this.http.post<string>(`${this.apiUrl}/Blob/loadProof`, formData);
  }

  getProductById(number1: number) {
    return this.http.get<ProductModel>(`${this.apiUrl}/Products/${number1}`);
  }

  getImageByName(name:string): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/Blob/${name}`, { responseType: 'blob' });
  }

  getImagePayment(name:string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Blob/proof/${name}`, { responseType: 'blob' });

  }

  putProduct(formDataProduct: ProductModel) {
    return this.http.put(`${this.apiUrl}/Products/${formDataProduct.idProduct}`, formDataProduct);
  }

  patchProduct(formDataProduct: DeleteProductModel) {
    return this.http.patch(`${this.apiUrl}/Products/EditState?id=${formDataProduct.idProduct}`,formDataProduct);
  }

  patchQuantity(formDataProduct: SearchProductModel, number:number) {
    return this.http.patch(`${this.apiUrl}/Products/UpdateQuantity?quantity=${number}`,formDataProduct);
  }

  getProductByNamePresentationSupplier(formDataSearchSend: SearchProductModel) {
    return this.http.get<ProductModel>(`${this.apiUrl}/Products/search?search=${formDataSearchSend.search}&suppliers=${formDataSearchSend.suppliers}&presentation=${formDataSearchSend.presentation}`);
  }

  getValidateProductByNamePresentationSupplier(formDataSearchSend: ValidateQuantity) {
    return this.http.get<ProductModel>(`${this.apiUrl}/Products/ValidateQuantity?search=${formDataSearchSend.search}&suppliers=${formDataSearchSend.suppliers}&presentation=${formDataSearchSend.presentation}&quantityProduct=${formDataSearchSend.quantityProduct}`);
  }
  getAllProducts() {
    return this.http.get<AllProductsModel[]>(`${this.apiUrl}/Products/all`);
  }

  getAll2Products() {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/Products/all`);
  }

  getAllProductsActive() {
    return this.http.get<AllProductsModel[]>(`${this.apiUrl}/Products/active`);
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
    return this.http.put(`${this.apiUrl}/Clients/${formDataUserClient.idClient}`, formDataUserClient);
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
    return this.http.put(`${this.apiUrl}/Suppliers/${formDataSupplier.idSupplier}`, formDataSupplier);
  }

  patchSupplier(formDataDeleteSupplier: DeleteSupplierModel) {
    return this.http.patch(`${this.apiUrl}/Suppliers/EditState`, formDataDeleteSupplier);
  }

  getUserByEmail(search: string) {
    return this.http.get<UserModelClient>(`${this.apiUrl}/Clients/searchEmail?search=${search}`);
  }

  getProductsOrders(search: number) {
    return this.http.get<AllProductsModel[]>(`${this.apiUrl}/Carts?idOrder=${search}`);
  }

  getUsers() {
    return this.http.get<UserModelClient[]>(`${this.apiUrl}/Clients/active`);
  }

  getOrders(){
    return this.http.get<OrdersModel[]>(`${this.apiUrl}/OrderHistories/all/last`);
  }

  getOrdersUser(){
    return this.http.get<OrdersModel[]>(`${this.apiUrl}/OrderHistories/client`);
  }

  getStatesOrders() {
    return this.http.get<StatusModel[]>(`${this.apiUrl}/Status`);
  }

  getStatesOrders2(name: string) {
    return this.http.get<StatusModel[]>(`${this.apiUrl}/Status/Search/${name}`);
  }

  putOrder(orderDetails: ImageUserModel) {
    return this.http.put(`${this.apiUrl}/Orders/${orderDetails.idOrder}`, orderDetails);
  }

  postOrder(order:OrdersModelNew) {
    return this.http.post(`${this.apiUrl}/Orders`, order);
  }

  postOrderHistory(orderHistory : OrderHistory){
    return this.http.post(`${this.apiUrl}/OrderHistories`, orderHistory)
  }
  getNameLogs() {
    return this.http.get<any[]>(`${this.apiUrl}/Logs`);
  }

  getDataLogs(name:string) {
    return this.http.get(`${this.apiUrl}/Logs/DownloadLogs/${name}`, { responseType: 'blob' });
  }

  getLowQuantity() {
    return this.http.get<NotificationsModel[]>(`${this.apiUrl}/Products/lowQuantity`);
  }

  getHistoricalProgress(idOrder: number) {
    return this.http.get<ProgressModel[]>(`${this.apiUrl}/OrderHistories/client/Order?idOrder=${idOrder}`);
  }
}
