import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {NgForm} from "@angular/forms";
import {CodeModel} from "./CodeModel";
import {emailModel} from "./EmailModel";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.component.html',
  styleUrls: ['./recover-account.component.css']
})
export class RecoverAccountComponent {
  inputValue: string = '';
  username: string;
  password: string;
  error: string;
  codigo: string;


  constructor(public authService: AuthService, private route: Router, private dataService : DataService, private toast:ToastrService) {
    this.username = "";
    this.password = "";
    this.error = "";
    this.codigo = "";
  }

  onSubmitOne() {
    this.authService.sendCodigo(this.authService.formEmail)
      .subscribe(
        (response: any) => {
          this.toast.success("Revise su correo", "Codigo enviado correctamente");
          this.dataService.setInputValue(this.authService.formEmail.email);
        },
        (error) => {
          this.error = 'Correo Invalido';
          this.toast.error("Intente nuevamente", "Codigo no enviado");
        }
      );
  }

  onSubmit() {
    this.authService.formCode.email = this.dataService.getInputValue();
    this.authService.validateCodigo(this.authService.formCode)
      .subscribe(
        (response: any) => {
          this.toast.success("", "Codigo valido");
          this.route.navigate(['/newPassword']);
        },
        (error) => {
          this.error = 'Codigo Invalido';
          this.toast.error("Intente nuevamente o solicite otro", "Codigo invalido");
        }
      );
  }

  updateInputValue() {
    this.dataService.setInputValue(this.inputValue);
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.authService.formCode = new CodeModel();
    this.authService.formEmail = new emailModel();
  }
}
