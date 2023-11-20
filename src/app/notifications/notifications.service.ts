import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  notificationsUpdated$ = new Subject<void>();

  constructor() {
  }
}
