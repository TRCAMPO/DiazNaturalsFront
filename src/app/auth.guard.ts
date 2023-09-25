import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, public cookieService: CookieService) {}

  canActivate(): boolean {
    if (this.cookieService.get("token")) {
      return true; // Permite el acceso a la ruta
    } else {
      this.router.navigate(['/login']); // Redirige al componente de inicio de sesión
      return false; // Bloquea el acceso a la ruta
    }
  }
}

