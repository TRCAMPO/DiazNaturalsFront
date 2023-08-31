import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserModel} from "./login/User.Model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '';

  formDataUser: UserModel = new UserModel();
  token: string = "";
  isLog: boolean = false;
  constructor(private http: HttpClient) {}

  login(user: UserModel) {
    return this.http.post(`${this.apiUrl}/`, user);
  }

  isLoggedIn() {
    return this.isLog;
  }

}
