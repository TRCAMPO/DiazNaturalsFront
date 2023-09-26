import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-home-page-user',
  templateUrl: './home-page-user.component.html',
  styleUrls: ['./home-page-user.component.css']
})
export class HomePageUserComponent {

  constructor(public authService: AuthService, public route:Router, public cookieService: CookieService) {
  }

  exit() {
    this.authService.isLog = false;
    this.authService.token = "";
    this.route.navigate(["/login"]);
    this.cookieService.delete('token');
  }
}
