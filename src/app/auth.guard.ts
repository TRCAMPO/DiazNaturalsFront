import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      console.log("entra");
      return true; // Permite el acceso a la ruta
    } else {
      this.router.navigate(['/login']); // Redirige al componente de inicio de sesión
      return false; // Bloquea el acceso a la ruta
    }
  }
}

