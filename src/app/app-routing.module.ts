import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {RecoverAccountComponent} from "./recover-account/recover-account.component";
import {NewPasswordComponent} from "./new-password/new-password.component";
import {HomePageComponent} from "./home-page/home-page.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "recovery", component: RecoverAccountComponent},
  { path: "newPassword", component: NewPasswordComponent},
  { path: "homePage", component: HomePageComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
