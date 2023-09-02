import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {RecuperarCuentaComponent} from "./recuperar-cuenta/recuperar-cuenta.component";
import {NuevaContrasenaComponent} from "./nueva-contrasena/nueva-contrasena.component";
import {HomePageComponent} from "./home-page/home-page.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "recovery", component: RecuperarCuentaComponent},
  { path: "newPassword", component: NuevaContrasenaComponent},
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
