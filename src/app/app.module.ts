import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import {RouterOutlet} from "@angular/router";


import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {HttpClientModule} from "@angular/common/http";
import {NgxPaginationModule} from "ngx-pagination";
import { RecuperarCuentaComponent } from './recuperar-cuenta/recuperar-cuenta.component';
import { NuevaContrasenaComponent } from './nueva-contrasena/nueva-contrasena.component';
import { HomePageComponent } from './home-page/home-page.component';



//import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecuperarCuentaComponent,
    NuevaContrasenaComponent,
    HomePageComponent

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

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
