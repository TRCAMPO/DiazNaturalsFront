import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent {

  constructor(public authService: AuthService, public route:Router, public cookieService: CookieService) {
  }

  exit() {
    this.authService.isLog = false;
    this.authService.token = "";
    this.route.navigate(["/login"]);
    this.cookieService.delete('token');
  }
}
