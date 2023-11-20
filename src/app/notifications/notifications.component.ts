import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NotificationsModel } from "./notifications.model";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @Input() notificationsStyles: any;
  @ViewChild('container') container: ElementRef | undefined;

  allNotifications: NotificationsModel[] = [];
  currentPage = 1;
  elementeForPage = 4;

  @Output() closeNotifications: EventEmitter<void> = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.getLowQuantity().subscribe((response) => {
      this.allNotifications = response;
    });
  }
}
