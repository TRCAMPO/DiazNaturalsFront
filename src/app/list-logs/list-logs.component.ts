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
       /*
        const year = fileName.substring(4, 8);
        const month = fileName.substring(8, 10);
        const day = fileName.substring(10, 12);
        const hour = fileName.substring(12, 14);
        const minute = fileName.substring(14, 16);
        const formattedDate = `${year}-${month}-${day} / ${hour}:${minute}`;
        this.nameInit.push(formattedDate);
        const originalDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);*/
      const date = fileName.substring(0, 10);
      const hour = fileName.substring(12, 20);
        const hourParts = hour.split('-');
         this.hours = hourParts[0];
        this.minute = hourParts[1] ; // Restar 1 al mes porque en JavaScript los meses van de 0 a 11
        this.second = hourParts[2];
        console.log(hourParts)
      const formattedDate = `${date} / ${this.hours}:${this.minute}:${this.second}`;
      this.nameInit.push(formattedDate);
        const dateParts = date.split('-');
        const year = +dateParts[0];
        const month = +dateParts[1] ; // Restar 1 al mes porque en JavaScript los meses van de 0 a 11
        const day = +dateParts[2];
        console.log(dateParts)
        //const hourParts = hour.split('-');
        //const hourOfDay = +hourParts[0];
        //const minute = +hourParts[1];

// Crear un objeto Date con la fecha actual
       // const currentDate = new Date(year, month, day, hourOfDay, minute);

// Calcular la fecha que será una semana después
       /* const oneWeekLater = new Date(currentDate);
        oneWeekLater.setDate(oneWeekLater.getDate() + 7);

// Obtener los componentes de la fecha una semana después
        const yearLater = oneWeekLater.getFullYear();
        const monthLater = `0${oneWeekLater.getMonth() + 1}`.slice(-2);
        const dayLater = `0${oneWeekLater.getDate()}`.slice(-2);
        const hourLater = `0${oneWeekLater.getHours()}`.slice(-2);
        const minuteLater = `0${oneWeekLater.getMinutes()}`.slice(-2);*/
          const t= year.toString()+"-"+month.toString()+"-"+day.toString();
      console.log("----*********-_________")
      console.log(t)
      const d= new Date(t);
      console.log(d)
        const wunaSemanaDespues = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
        const fechaFormaateada = (wunaSemanaDespues.toISOString().split('T')[0])+ " / 11:59:99";
        console.log('formato deseado):', fechaFormaateada);
       // Formatear la fecha una semana después
        //const formattedWeekLaterDate = `${yearLater}-${monthLater}-${dayLater} / ${hourLater}:${minuteLater}`;
        const cuurrentDate = new Date(year, month, day);
      //  const fechaDada = new Date(`${yearLater}-${monthLater}-${dayLater}`);
        const unaSemanaDespues = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
        const fechaFormateada = unaSemanaDespues.toISOString().split('T')[0];
        console.log('-------------Fecha fecha:', fechaFormateada);
        console.log('-------------dddddd:', cuurrentDate);
        this.nameEnd.push(fechaFormaateada)
      /*const originalDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
       const nextWeekDate = new Date(originalDate);
       nextWeekDate.setDate(nextWeekDate.getDate() + 7);

       const nextWeekYear = nextWeekDate.getFullYear();
       const nextWeekMonth = `0${nextWeekDate.getMonth() + 1}`.slice(-2);
       const nextWeekDay = `0${nextWeekDate.getDate()}`.slice(-2);
       const nextWeekHour = `0${nextWeekDate.getHours()}`.slice(-2);
       const nextWeekMinute = `0${nextWeekDate.getMinutes()}`.slice(-2);
       const formattedNextWeekDate = `${nextWeekYear}-${nextWeekMonth}-${nextWeekDay} / ${nextWeekHour}:${nextWeekMinute}`;
       this.nameEnd.push(formattedNextWeekDate);*/
      }
    );
    const fechaDada = new Date('2023-11-17'); // Puedes cambiar esta fecha a la fecha dada
    const unaSemanaDespues = new Date(fechaDada.getTime() + 7 * 24 * 60 * 60 * 1000);
    const fechaFormateada = unaSemanaDespues.toISOString().split('T')[0];
    console.log('Fecha una semana después (formato deseado):', fechaFormateada);
    console.log('Fecha dada:', fechaDada.toDateString());
    console.log('Fecha dada:', unaSemanaDespues);
    console.log('Fecha una semana después:', unaSemanaDespues.toDateString());
    console.log("_____________");
    console.log(this.nameInit);
    console.log("_____________");
    console.log(this.nameEnd);
    console.log('Fecha dada:', fechaDada.toDateString());
    console.log('Fecha una semana después:', unaSemanaDespues.toDateString());
  }

  insertsNamesEnd() {
      const length = this.nameInit.length;
      console.log(length);
    for (let i = 0; i < length; i++) {
      const dataaAux = {
        orderLog: i+1,
        nameInit: this.nameInit[i],
        nameEnd: this.nameEnd[i],
        nameOriginal: this.nameLogs[i]
      };

      this.dataLogs.push(dataaAux);
    } console.log("_______________jjj_");
     console.log(this.dataLogs);
    }


  downloadFile(name: string) {
    console.log("shsh" +name)
    console.log("DESCARGA DEL ARCHIVO");
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
