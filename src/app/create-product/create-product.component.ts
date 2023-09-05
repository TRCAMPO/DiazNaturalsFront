import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {
  inputValue: string = '';
  username: string;
  password: string;
  error: string;
  sanitizer: any;
  imageFile: File | null = null;
  imageUrl: string | null = null;


  constructor(public authService: AuthService, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.username = "";
    this.password = "";
    this.error = "";

  }

  onSubmit() {
    this.authService.login(this.authService.formDataUser)
      .subscribe(
        (response: any) => {
          this.authService.token = response.token;
          this.authService.isLog = true;
          this.toast.success('Se ha iniciado sesión exitosamente', 'Inicio de sesión');
          this.route.navigate(['/homePage']);
          //this.authService.formDataUser = new UserModel();
        },
        (error) => {
          this.error = 'Credenciales inválidas';
          this.toast.error('Credenciales inválidas', 'Error en el inicio de sesión');
        }
      );


  }

  updateInputValue() {
    this.dataService.setInputValue(this.inputValue);
  }

  resetForm(form: NgForm) {
    form.form.reset();
    //this.authService.formDataUser = new UserModel();
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    // @ts-ignore
    const file = event.dataTransfer.files[0];
    const blob = file.slice(0, file.size, file.type.replace(/\/(jpeg|png|gif)$/, '/jpg'));
    this.imageFile = new File([blob], file.name, {type: 'image/jpeg'});

    const imageUrl = URL.createObjectURL(blob);
    this.imageUrl = imageUrl;
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    // @ts-ignore
    const file = target.files[0];
    const blob = file.slice(0, file.size, file.type.replace(/\/(jpeg|png|gif)$/, '/jpg'));
    this.imageFile = new File([blob], file.name, {type: 'image/jpeg'});
    this.imageUrl = URL.createObjectURL(blob);
  }

  clearPreview() {
    this.imageUrl = null;
  }
}
