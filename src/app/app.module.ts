import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {NgxPaginationModule} from "ngx-pagination";
import { RecoverAccountComponent } from './recover-account/recover-account.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ConfirmDialogComponent } from './confirm-dialog-edit-product/confirm-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { DeleteProductComponent } from './delete-product/delete-product.component';
import {ConfirmDialogComponentDeleteProduct} from "./confirm-dialog-delete-product/confirm-dialog.component";
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ConfirmDialogEditUserComponent } from './confirm-dialog-edit-user/confirm-dialog-edit-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { ConfirmDialogDeleteUserComponent } from './confirm-dialog-delete-user/confirm-dialog-delete-user.component';
import { TokenInterceptor } from './tokenInterceptor';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { DeleteSupplierComponent } from './delete-supplier/delete-supplier.component';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { ConfirmDialogEditSupplierComponent } from './confirm-dialog-edit-supplier/confirm-dialog-edit-supplier.component';
import { ConfirmDialogDeleteSupplierComponent } from './confirm-dialog-delete-supplier/confirm-dialog-delete-supplier.component';
import { RestrictDashDirective } from './restrict-dash.directive';
import { HomePageUserComponent } from './home-page-user/home-page-user.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ChangeDatesUserComponent} from "./change-dates-user/change-dates-user.component";
import { HeaderUserComponent } from './header-user/header-user.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProductInformationComponent } from './product-information/product-information.component';
import { ValidatePaymentComponent } from './validate-payment/validate-payment.component';
import { ValidatePaymentUserComponent } from './validate-payment-user/validate-payment-user.component';
import { ListSuppliersComponent } from './list-suppliers/list-suppliers.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ConfirmDialogCreateOrderComponent } from './confirm-dialog-create-order/confirm-dialog-create-order.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { ListOrdersUsersComponent } from './list-orders-users/list-orders-users.component';
import { ValidatedOrderComponent } from './validated-order/validated-order.component';
import { ListLogsComponent } from './list-logs/list-logs.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ModifyQuantitiesComponent } from './modify-quantities/modify-quantities.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoverAccountComponent,
    NewPasswordComponent,
    HomePageComponent,
    CreateProductComponent,
    EditProductComponent,
    ConfirmDialogComponent,
    DeleteProductComponent,
    ConfirmDialogComponentDeleteProduct,
    CreateUserComponent,
    EditUserComponent,
    ConfirmDialogEditUserComponent,
    DeleteUserComponent,
    ConfirmDialogDeleteUserComponent,
    EditSupplierComponent,
    DeleteSupplierComponent,
    CreateSupplierComponent,
    ConfirmDialogEditSupplierComponent,
    ConfirmDialogDeleteSupplierComponent,
    RestrictDashDirective,
    HomePageUserComponent,
    CatalogComponent,
    ChangeDatesUserComponent,
    HeaderUserComponent,
    HeaderAdminComponent,
    FooterComponent,
    CartComponent,
    ChangePasswordComponent,
    ProductInformationComponent,
    ValidatePaymentComponent,
    ValidatePaymentUserComponent,
    ProductInformationComponent,
    ListSuppliersComponent,
    ListUsersComponent,
    ConfirmDialogCreateOrderComponent,
    ListProductsComponent,
    ListOrdersComponent,
    ListOrdersUsersComponent,
    ValidatedOrderComponent,
    ListLogsComponent,
    NotificationsComponent,
    ModifyQuantitiesComponent


  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxPaginationModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    MatDialogModule,
    // ToastrModule added
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true},
],
  bootstrap: [AppComponent]
})
export class AppModule { }
