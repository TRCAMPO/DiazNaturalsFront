import {ChangeDetectorRef, Component, computed, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import {Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from "@angular/material/dialog";
import {StateModel} from "../create-user/state.model";
import {CytiModel} from "../create-user/city.model";
import {UserModelClient} from "../create-user/userClient.model";
import {SupplierSearchModel} from "../edit-supplier/supplierSearch.model";
import {ConfirmDialogEditUserComponent} from "../confirm-dialog-edit-user/confirm-dialog-edit-user.component";
import {forkJoin} from "rxjs";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-change-dates-user',
  templateUrl: './change-dates-user.component.html',
  styleUrls: ['./change-dates-user.component.css', './change-dates-user2.component.css']
})
export class ChangeDatesUserComponent implements OnInit{
  // @ts-ignore
  @ViewChild('fileInput') fileInputRef: ElementRef;
  states: StateModel[] = [];
  citys: CytiModel[] = [];
  citysOrigin: CytiModel[] = [];
  disabledInput: boolean = true;
  backgroundColor: string = "rgba(0, 0, 0, 0.12)";
  backgroundColor2: string = "#f5f6f7";

  ngOnInit() {
    const statesObservable = this.authService.getStates();
    const citysObservable = this.authService.getCitys();
    const userObservable = this.authService.getUserByEmail(this.cookies.get("email"));

    forkJoin({
      states: statesObservable,
      citys: citysObservable,
      user: userObservable
    }).subscribe({
      next: (results) => {
        this.states = results.states;
        this.citysOrigin = results.citys;

        this.authService.formDataUserClient = results.user;
        // @ts-ignore
        this.authService.formDataStates.id = this.states.find(state => state.name == this.authService.formDataUserClient.stateClient)?.id;
        this.authService.formDataCitys.name = this.authService.formDataUserClient.cityClient;
        this.showCitys(this.states.find(state => state.name == this.authService.formDataUserClient.stateClient)?.id);
      },
      error: (error) => {
        // Manejar errores si es necesario
        console.error('Error:', error);
      }
    });
  }
  constructor(private cookies: CookieService, private cdr: ChangeDetectorRef, public dialog: MatDialog, public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.authService.formDataUserClient = new UserModelClient();
    this.authService.formDataStates = new StateModel();
    this.authService.formDataCitys = new CytiModel();
    this.authService.formDataSearchUser = new SupplierSearchModel;
  }

  showCitys(id: number | undefined) {
    this.citys = [];
    // @ts-ignore
    this.citys = this.citysOrigin.filter(city => city.departmentId == id);
  }

  onSubmit() {
    if(this.checkSupplierPhone(this.authService.formDataUserClient)){
      this.toast.info("Por favor coloque un número celular válido","Formato Incorrecto");
    } else if( this.isUserModelClientValid(this.authService.formDataUserClient)) {
      this.authService.formDataUserClient.phoneClient = this.authService.formDataUserClient.phoneClient + "";
      if (!this.isValidEmail(this.authService.formDataUserClient.emailClient)) {
        this.toast.info("Por favor coloque un correo válido", "Formato Incorrecto Correo");
      } else if(!this.isValidNit(this.authService.formDataUserClient.nitClient)){
        this.toast.info("Por favor ingrese un nit de mas de 5 digitos","Formato Incorrecto");
      } else if (!this.isValidPhone(this.authService.formDataUserClient.phoneClient)) {
        this.toast.info("Por favor coloque un número celular válido", "Formato Incorrecto");
      } else {
        this.authService.formDataUserClient.stateClient = this.states.find(state => state.id == this.authService.formDataStates.id)?.name;
        this.authService.formDataUserClient.cityClient = this.authService.formDataCitys.name;
        this.authService.putUser(this.authService.formDataUserClient).subscribe(
          response => {
            this.toast.success("Usuario modificado correctamente", "Usuario Modificado");
            this.resetForm();
          },
          error => {
            if (error.status == 409) {
              this.toast.error(error.error, 'Modificación de Usuario');
            } else {
              this.toast.error("Surgio un problema en la modificación", "Usuario no Modificado");
            }
          }
        );
      }
    }else{
      this.toast.info("Por favor llene todos los campos","Formulario Incompleto");
    }
  }

  isValidNit(nit: string): boolean {
    return nit.length >= 5;
  }

  isValidPhone(phone: string): boolean {
    if(/[^0-9]/.test(phone))return false;
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

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogEditUserComponent, {
      panelClass: 'custom-dialog-overlay', // Clase CSS personalizada
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmit();
      } else {
      }
    });
  }

  resetForm() {
    this.authService.formDataUserClient = new UserModelClient();
    this.authService.formDataCitys = new CytiModel();
    this.authService.formDataStates = new StateModel();
    this.changePage();
  }

  changePage() {
    this.route.navigate(['/homePage']);
  }

  checkSupplierPhone(user: UserModelClient) {
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
      user.phoneClient === null &&
      user.cityClient !== '' &&
      user.cityClient !== null &&
      user.stateClient !== '' &&
      user.stateClient !== null &&
      user.nameContactClient !== '' &&
      user.nameContactClient !== null
    );
  }

}

