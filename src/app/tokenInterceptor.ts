import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {CookieService} from "ngx-cookie-service"; // Importa el servicio de autenticación

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,  public cookieService: CookieService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token= this.cookieService.get('token');
    // Clona la solicitud original y agrega el encabezado de autorización si hay un token
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Pasa la solicitud clonada al siguiente manipulador
    return next.handle(request);
  }
}
