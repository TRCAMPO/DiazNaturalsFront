import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-list-logs',
  templateUrl: './list-logs.component.html',
  styleUrls: ['./list-logs.component.css']
})
export class ListLogsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  downloadFile() {
    console.log("DESCARGA DEL ARCHIVO");
  }
}
