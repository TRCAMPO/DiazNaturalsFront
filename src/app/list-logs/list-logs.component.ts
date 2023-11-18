import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {NameLogs} from "./NameLogs";
import {min} from "rxjs";

@Component({
  selector: 'app-list-logs',
  templateUrl: './list-logs.component.html',
  styleUrls: ['./list-logs.component.css']
})
export class ListLogsComponent implements OnInit {
  nameLogDownloadLog: string = "";
  nameLogs: string[] = [];
  nameInit: string[] = [];
  nameEnd: string[] = [];
  nameEndTwo: string[] = [];
  dataLogs: NameLogs[] = [];
  // @ts-ignore

  currentPage = 1;
  elementeForPage = 10;
  hours: string="";
  minute: string="";
  second: string="";
  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getNameLogs().subscribe((data) => {
      this.nameLogs = data;
      console.log(this.nameLogs);
      this.nameLogs.forEach((file, index) => {
        if (file.toLowerCase().includes('log_copia.txt')) {
          // Eliminar el elemento del arreglo por su índice
          this.nameLogs.splice(index, 1);
        }
      });
      console.log(this.nameLogs);
      this.insertsNames();
      this.insertsNamesEnd()
    });

  }

  insertsNames() {
    this.nameLogs.forEach(fileName => {
        const date = fileName.substring(0, 10);
        const hour = fileName.substring(12, 20);
        const hourParts = hour.split('-');
        this.hours = hourParts[0];
        this.minute = hourParts[1] ;
        this.second = hourParts[2];
        console.log(hourParts)
        const formattedDate = `${date} / ${this.hours}:${this.minute}:${this.second}`;
        this.nameInit.push(formattedDate);
        const dateParts = date.split('-');
        const year = +dateParts[0];
        const month = +dateParts[1];
        const day = +dateParts[2];
        const t= year.toString()+"-"+month.toString()+"-"+day.toString();
        const formattedDateTwo = `${year}-${month}-30`+ " / 11:59:99"
         console.log("mmmmmmmmmmmmm");
         console.log(formattedDateTwo);
        const d= new Date(t);
        const wunaSemanaDespues = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
        const fechaFormaateada = (wunaSemanaDespues.toISOString().split('T')[0])+ " / 11:59:99";
        this.nameEnd.push(fechaFormaateada);
        this.nameEndTwo.push(formattedDateTwo)
      }
    );
  }

  insertsNamesEnd() {
      const length = this.nameInit.length;
      console.log(length);
    for (let i = 0; i < length; i++) {
      const dataaAux = {
        orderLog: i+1,
        nameInit: this.nameInit[i],
        nameEnd: this.nameEndTwo[i],
        nameOriginal: this.nameLogs[i]
      };
      this.dataLogs.push(dataaAux);
    }
    }
  downloadFile(name: string) {
    this.authService.getDataLogs(name).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'log.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

}
