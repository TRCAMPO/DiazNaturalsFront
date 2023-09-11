import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {StateModel} from "./state.model";
import {CytiModel} from "./city.model";
import {UserModelClient} from "./userClient.model";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css', './create-user2.component.css']
})
export class CreateUserComponent implements OnInit{
  // @ts-ignore
  @ViewChild('fileInput') fileInputRef: ElementRef;
  states: StateModel[] = [];
  citys: CytiModel[] = [];
  citysOrigin: CytiModel[] = [];

  ngOnInit() {
    this.authService.getStates().subscribe(data => {
      this.states = data;
    });
    this.authService.getCitys().subscribe(data => {
      this.citysOrigin = data;
    });
  }
  constructor(public authService: AuthService, private route: Router, private dataService : DataService, private toast: ToastrService) {
  }

  onSubmit() {
    this.authService.formDataUserClient.phoneClient = this.authService.formDataUserClient.phoneClient + "";
    this.authService.formDataUserClient.stateClient = this.states.find(state => state.id == this.authService.formDataStates.id)?.name;
    this.authService.formDataUserClient.cityClient = this.authService.formDataCitys.name;
    if( this.isUserModelClientValid(this.authService.formDataUserClient)) {
      if(!this.isValidEmail(this.authService.formDataUserClient.emailClient)) {
        this.toast.info("Por favor coloque un correo válido","Formato Incorrecto Correo");
      } else if(!this.isValidPhone(this.authService.formDataUserClient.phoneClient)) {
        this.toast.info("Por favor coloque un número celular válido","Formato Incorrecto");
      }else {
        this.authService.postUser(this.authService.formDataUserClient).subscribe(
          response => {
            this.toast.success("Usuario creado correctamente", "Usuario Creado");
            this.changePage();
          },
          error => {
            if (error.status == 409) {
              this.toast.error(error.error, "Usuario no creado");
            }
          }
        );
      }
    }else {
      this.toast.info("Por favor llene todos los campos","Formulario Incompleto");
    }
  }

  isValidPhone(phone: string): boolean {
    return phone.length === 10;
  }

  isValidEmail(email: string): boolean {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // Comprueba si el correo electrónico coincide con la expresión regular
    return emailRegex.test(email);
  }
  isUserModelClientValid(user: UserModelClient): boolean {
    return (
      user !== null &&
      user !== undefined &&
      user.nitClient !== '' &&
      user.nitClient !== null &&
      user.nameClient !== '' &&
      user.nameClient !== null &&
      user.emailClient !== '' &&
      user.emailClient !== null &&
      user.addressClient !== '' &&
      user.addressClient !== null &&
      user.phoneClient !== '' &&
      user.phoneClient !== null &&
      user.phoneClient !== "null" &&
      user.cityClient !== '' &&
      user.cityClient !== null &&
      user.stateClient !== '' &&
      user.stateClient !== null &&
      user.nameContactClient !== '' &&
      user.nameContactClient !== null

    );
  }

  changePage() {
    this.resetForm();
    this.route.navigate(['/homePage']);
  }

  resetForm() {
    this.authService.formDataUserClient = new UserModelClient();
    this.route.navigate(['/homePage']);
  }

  showCitys(id: number) {
    this.citys = [];
    this.citys = this.citysOrigin.filter(city => city.departmentId == id);
  }

  limitDigits(event: any) {
    const maxLength = 10; // Establece la longitud máxima permitida
    const inputValue = event.target.value;
    if (inputValue.length > maxLength) {
      event.target.value = inputValue.slice(0, maxLength);
      this.authService.formDataUserClient.phoneClient = event.target.value;
    }
  }

}
