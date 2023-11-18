import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {RecoverAccountComponent} from "./recover-account/recover-account.component";
import {NewPasswordComponent} from "./new-password/new-password.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {CreateProductComponent} from "./create-product/create-product.component";
import {EditProductComponent} from "./edit-product/edit-product.component";
import {DeleteProductComponent} from "./delete-product/delete-product.component";
import {CreateUserComponent} from "./create-user/create-user.component";
import {EditUserComponent} from "./edit-user/edit-user.component";
import {DeleteUserComponent} from "./delete-user/delete-user.component";
import {CreateSupplierComponent} from "./create-supplier/create-supplier.component";
import {EditSupplierComponent} from "./edit-supplier/edit-supplier.component";
import {DeleteSupplierComponent} from "./delete-supplier/delete-supplier.component";
import {HomePageUserComponent} from "./home-page-user/home-page-user.component";
import {CatalogComponent} from "./catalog/catalog.component";
import {ChangeDatesUserComponent} from "./change-dates-user/change-dates-user.component";
import {CartComponent} from "./cart/cart.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ProductInformationComponent} from "./product-information/product-information.component";
import {ValidatePaymentComponent} from "./validate-payment/validate-payment.component";
import {ValidatePaymentUserComponent} from "./validate-payment-user/validate-payment-user.component";
import {ListSuppliersComponent} from "./list-suppliers/list-suppliers.component";
import {ListUsersComponent} from "./list-users/list-users.component";
import {ListProductsComponent} from "./list-products/list-products.component";
import {ListOrdersComponent} from "./list-orders/list-orders.component";
import {ListOrdersUsersComponent} from "./list-orders-users/list-orders-users.component";
import {ValidatedOrderComponent} from "./validated-order/validated-order.component";
import {ListLogsComponent} from "./list-logs/list-logs.component";
import {ModifyQuantitiesComponent} from "./modify-quantities/modify-quantities.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  { path: "recovery", component: RecoverAccountComponent},
  { path: "newPassword", component: NewPasswordComponent},
  { path: "homePage", component: HomePageComponent, canActivate: [AuthGuard]},
  { path: "createProduct", component: CreateProductComponent, canActivate: [AuthGuard]},
  { path: "editProduct", component: EditProductComponent, canActivate: [AuthGuard]},
  { path: "deleteProduct", component: DeleteProductComponent, canActivate: [AuthGuard]},
  { path: "createUser", component: CreateUserComponent, canActivate: [AuthGuard]},
  { path: "editUser", component: EditUserComponent, canActivate: [AuthGuard]},
  { path: "deleteUser", component: DeleteUserComponent, canActivate: [AuthGuard]},
  { path: "createSupplier", component: CreateSupplierComponent, canActivate: [AuthGuard]},
  { path: "editSupplier", component: EditSupplierComponent, canActivate: [AuthGuard]},
  { path: "deleteSupplier", component: DeleteSupplierComponent, canActivate: [AuthGuard]},
  { path: "listSupplier", component: ListSuppliersComponent, canActivate: [AuthGuard]},
  { path: "listUser", component: ListUsersComponent, canActivate: [AuthGuard]},
  { path: "listProducts", component: ListProductsComponent, canActivate: [AuthGuard]},
  { path: "listOrders", component: ListOrdersComponent, canActivate: [AuthGuard]},
  { path: "modifyQuantities", component: ModifyQuantitiesComponent, canActivate: [AuthGuard]},

  { path: "homePageUser", component: HomePageUserComponent, canActivate: [AuthGuard]},
  { path: "catalog", component: CatalogComponent, canActivate: [AuthGuard]},
  { path: "changeInformation", component: ChangeDatesUserComponent, canActivate: [AuthGuard]},
  { path: "cart", component: CartComponent, canActivate: [AuthGuard]},
  { path: "changePassword", component: ChangePasswordComponent, canActivate: [AuthGuard]},
  { path: "productInformation", component: ProductInformationComponent, canActivate: [AuthGuard]},
  { path: "validatePayment", component: ValidatePaymentComponent, canActivate: [AuthGuard]},
  { path: "validatePaymentUser", component: ValidatePaymentUserComponent, canActivate: [AuthGuard]},
  { path: "listOrdersUser", component: ListOrdersUsersComponent, canActivate: [AuthGuard]},
  { path: "validatedOrder", component: ValidatedOrderComponent, canActivate: [AuthGuard]},
  { path: "listLogs", component: ListLogsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes , { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
