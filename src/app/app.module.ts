import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import {RouterOutlet} from "@angular/router";


import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {HttpClientModule} from "@angular/common/http";
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
import {ConfirmDialogComponentDelete} from "./confirm-dialog-delete-product/confirm-dialog.component";
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ConfirmDialogEditUserComponent } from './confirm-dialog-edit-user/confirm-dialog-edit-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';

//import {NgxPaginationModule} from "ngx-pagination";

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
    ConfirmDialogComponentDelete,
    CreateUserComponent,
    EditUserComponent,
    ConfirmDialogEditUserComponent,
    DeleteUserComponent,

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
