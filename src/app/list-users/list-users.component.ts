import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {SharedDataServiceUser} from "./shareDataServiceUser";
import {
  ConfirmDialogDeleteUserComponent
} from "../confirm-dialog-delete-user/confirm-dialog-delete-user.component";
import {MatDialog} from "@angular/material/dialog";
import {UserModelClient} from "../create-user/userClient.model";

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit{
  @Input() cartStyles: any;
  users: UserModelClient[] = [];
  usersOrigin: UserModelClient[] = [];
  currentPage = 1;
  elementeForPage = 5;
  constructor(public dialog: MatDialog, private toast: ToastrService, public authService: AuthService, public router: Router, private sharedDataService: SharedDataServiceUser)  {

  }
  ngOnInit() {
    this.authService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.usersOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar usuarios", "Error en la Búsqueda");
      }
    );
  }

  deleteproduct(nameUser: string){
    this.authService.getUserByName(nameUser).subscribe(
      (data) => {
        this.authService.formDataUserClient = data;
      },
      (error) => {
      }
    );
    this.openConfirmationDialog();
  }

  editproduct(nameSupplier: string){
    const productData = nameSupplier;
    // Utiliza el servicio para establecer los datos
    this.sharedDataService.setProductData(productData);
    // Navega a la pantalla de editar producto
    this.router.navigate(['/editUser']);
  }

  searchEditUser() {
    this.authService.formDataUserClient = new UserModelClient();
    this.users = this.usersOrigin;
    if (this.authService.formDataSearchUser.search) {
      this.users = this.users.filter(user =>
        user.nameClient.toLowerCase().includes(this.authService.formDataSearchUser.search.toLowerCase()) ||
        user.nitClient.toString().includes(this.authService.formDataSearchUser.search)
      );
    } else {
      this.authService.getUsers().subscribe(
        (data) => {
          this.users = data;
        },
        () => {
          this.toast.error("No se pudieron encontrar usuarios", "Error en la Búsqueda");
        }
      );
    }
  }

  onSubmit() {
    this.authService.formDataUserClientDelete.nitClient = this.authService.formDataUserClient.nitClient;
    this.authService.formDataUserClientDelete.isActive = false;
    this.authService.patchUser(this.authService.formDataUserClientDelete).subscribe(
      response => {
        this.toast.success("Usuario eliminado correctamente", "Usuario Eliminado");
        this.resetForm();
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
    this.authService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.usersOrigin = data;
        // @ts-ignore
      },
      () => {
        this.toast.error("No se pudieron encontrar usuarios", "Error en la Búsqueda");
      }
    );
  }

}

