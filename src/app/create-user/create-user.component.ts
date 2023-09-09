import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../shared/data.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from '@angular/platform-browser';
import {StateModel} from "./state.model";
import {CytiModel} from "./city.model";
import {UserModelClient} from "./userClient.model";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit{
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
  constructor(public authService: AuthService, public sanitizer: DomSanitizer, private route: Router, private dataService : DataService, private toast: ToastrService) {
    this.username = "";
    this.password = "";
    this.error = "";
  }

  onSubmit() {
    this.authService.formDataUserClient.phoneClient = this.authService.formDataUserClient.phoneClient+"";
    this.authService.formDataUserClient.stateClient = this.states.find(state => state.id == this.authService.formDataStates.id)?.name;
    this.authService.formDataUserClient.cityClient = this.authService.formDataCitys.name;
    this.authService.postUser(this.authService.formDataUserClient).subscribe(
      response => {
        this.toast.success("Usuario creado correctamente", "Usuario Creado");
        this.changePage();
      },
      error => {
        this.toast.error("Usuario no creado", "Usuario no creado");
      }
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
}
