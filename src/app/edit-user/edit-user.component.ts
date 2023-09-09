import {ChangeDetectorRef, Component, computed, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog-edit-product/confirm-dialog.component";
import {StateModel} from "../create-user/state.model";
import {CytiModel} from "../create-user/city.model";
import {UserModelClient} from "../create-user/userClient.model";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit{
  inputValue: string = '';
  username: string;
  password: string;
  error: string;
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
  constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog, public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.username = "";
    this.password = "";
    this.error = "";
  }

  showCitys(id: number | undefined) {
    this.citys = [];
    // @ts-ignore
    this.citys = this.citysOrigin.filter(city => city.departmentId == id);
  }

  onSubmit() {
    this.authService.formDataUserClient.stateClient = this.states.find(state => state.id == this.authService.formDataStates.id)?.name;
    this.authService.formDataUserClient.cityClient = this.authService.formDataCitys.name;
    this.authService.formDataUserClient.idClient = 0;
    this.authService.formDataUserClient.phoneClient = this.authService.formDataUserClient.phoneClient+"";
    this.authService.putUser(this.authService.formDataUserClient).subscribe(
      response => {
        this.toast.success("Usuario modificado correctamente", "Usuario Modificado");
        this. resetForm();
      },
      error => {
        this.toast.error("Surgio un problema en la modificación", "Usuario no Modificado");
      }
    );
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
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

  searchUserClient() {
    this.authService.formDataUserClient = new UserModelClient();
    this.authService.formDataCitys = new CytiModel();
    this.authService.formDataStates = new StateModel();
    this.authService.getUserByName(this.authService.formDataSearchUser.search).subscribe(
      (data) => {
        this.authService.formDataUserClient = data;
        // @ts-ignore
        this.authService.formDataStates.id =this.states.find(state => state.name == this.authService.formDataUserClient.stateClient)?.id;

        this.authService.formDataCitys.name = this.authService.formDataUserClient.cityClient;
        this.showCitys(this.states.find(state => state.name == this.authService.formDataUserClient.stateClient)?.id);
        this.toast.success("Se encontro el Cliente","Cliente Encontrado")
      },
      (error) => {
        this.toast.error("No se pudo encontrar el cliente", "Error en la Búsqueda");
      }
    );
  }
}
