import { Component } from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  constructor(public authService: AuthService) {
  }
}
