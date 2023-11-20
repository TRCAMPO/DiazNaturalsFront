import {Component, OnInit} from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import {NotificationsModel} from "../notifications/notifications.model";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  showNotifications: boolean = false;
  lowQuantities: NotificationsModel[] = [];

  constructor(public authService: AuthService, public route: Router, public cookieService: CookieService) {}

  ngOnInit() {
    this.authService.getLowQuantity().subscribe((response) => {
      this.lowQuantities = response;
    });
  }

  exit() {
    this.authService.isLog = false;
    this.authService.token = "";
    this.route.navigate(["/login"]);
    this.cookieService.delete('token');
  }

  openNotifications() {
    this.showNotifications = !this.showNotifications; // Cambiar el valor de showCart al hacer clic en el botón
  }

  onNotificationsClosed(event: any) {
    this.showNotifications = false;
  }

}
