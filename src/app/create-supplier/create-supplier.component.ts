import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {SupplierModel} from "./supplier.model";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.css']
})
export class CreateSupplierComponent {


  constructor(public authService: AuthService, private route: Router, private toast: ToastrService) {
    this.resetForm();
  }

  onSubmit() {
    this.authService.postSupplier(this.authService.formDataSupplier).subscribe(
      (response: any) => {
        this.toast.success('Se ha creado el proveedor con exito', 'Creación de Proveedor');
        this.resetForm();
      },
      (error) => {
        this.toast.error('Falló la creación del proveedor', 'Creación de Proveedor');
      }
    );
  }

  resetForm() {
    this.authService.formDataSupplier = new SupplierModel();
  }
}
