import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';
import {CookieService} from "ngx-cookie-service";
import {DataService} from "./shared/data.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, public cookieService: CookieService, private rol:DataService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.cookieService.get("token")) {
      const userRole = this.rol.getInputValue2();
      const routeName = route.routeConfig?.path;

      const allowedRoutesByRole = {
        admin: ['homePage', 'createProduct', 'editProduct', 'deleteProduct', 'createUser', 'editUser', 'deleteUser', 'createSupplier', 'editSupplier', 'deleteSupplier', 'changePassword'],

        client: ['homePageUser', 'catalog', 'changeInformation', 'cart', 'changePassword', 'productInformation'],
      };

      // Verifica si el rol actual tiene permiso para acceder a la ruta actual
      // @ts-ignore
      if (allowedRoutesByRole[this.cookieService.get("rol")].includes(routeName)) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      this.router.navigate(['/login']); // Redirige al componente de inicio de sesión
      return false; // Bloquea el acceso a la ruta
    }
  }
}

