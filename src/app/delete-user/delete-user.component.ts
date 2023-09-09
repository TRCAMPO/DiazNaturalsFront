import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from "@angular/material/dialog";
import {StateModel} from "../create-user/state.model";
import {CytiModel} from "../create-user/city.model";
import {UserModelClient} from "../create-user/userClient.model";
import {ConfirmDialogDeleteUserComponent} from "../confirm-dialog-delete-user/confirm-dialog-delete-user.component";

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit{
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
  constructor(public dialog: MatDialog, public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
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
    this.authService.patchUser(this.authService.formDataUserClientDelete).subscribe(
      response => {
        this.toast.success("Usuario eliminado correctamente", "Usuario Eliminado");
      },
      error => {
        this.toast.error("Surgio un problema en la eliminación", "Usuario no Eliminado");
      }
    );
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogDeleteUserComponent, {
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
    this.changePage();
  }

  changePage() {
    this.route.navigate(['/homePage']);
  }

  searchUserClient() {
    this.authService.getUserByName(this.authService.formDataSearchUser.search).subscribe(
      (data) => {
        this.authService.formDataUserClient = data;

        // @ts-ignore
        this.authService.formDataStates.name = data.stateClient;
        this.authService.formDataCitys.name = this.authService.formDataUserClient.cityClient;
        this.showCitys(this.states.find(state => state.name == this.authService.formDataUserClient.stateClient)?.id);
        this.toast.success("Se encontro el producto","Producto Encontrado")
      },
      (error) => {
        this.toast.error("No se pudo encontrar el producto", "Error en la Búsqueda");
      }
    );
  }
}

