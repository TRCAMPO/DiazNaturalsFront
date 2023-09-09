import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "recovery", component: RecoverAccountComponent},
  { path: "newPassword", component: NewPasswordComponent},
  { path: "homePage", component: HomePageComponent},
  { path: "createProduct", component: CreateProductComponent},
  { path: "editProduct", component: EditProductComponent},
  { path: "deleteProduct", component: DeleteProductComponent},
  { path: "createUser", component: CreateUserComponent},
  { path: "editUser", component: EditUserComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
