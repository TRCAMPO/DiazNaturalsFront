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
  { path: "deleteSupplier", component: DeleteSupplierComponent, canActivate: [AuthGuard]}

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes , { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
