import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {AllProductsModel} from "./AllProductsModel";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  imageFile: File | null = null;
  imageUrl: string | null = null;
  // @ts-ignore
  private blob: Blob;
  products: AllProductsModel[] = []; // Ajusta el tipo de products
  productChunks: AllProductsModel[][] = []; // Ajusta el tipo de productChunks

  constructor(
    public authService: AuthService,
    public route: Router,
    public cookieService: CookieService
  ) {}

  ngOnInit() {
    // Realiza una solicitud GET a la API para obtener los productos
    this.authService.getAllProductsActive().subscribe((response) => {
      this.products = response;
      this.products.forEach(imgProduct => {
        console.log(imgProduct.image);
        this.authService.getImageByName(this.formatImageName(imgProduct.image)).subscribe((imageBlob: Blob) => {
          this.blob = imageBlob;
          const reader = new FileReader();
          reader.onload = () => {
            imgProduct.imageNewUrl = reader.result as string; // Convierte el Blob en una URL de datos
          };
          reader.readAsDataURL(imageBlob); // Lee el Blob como una URL de datos
        }, error => {
          console.error('Error al cargar la imagen', error);
        });
      });

      // Divide los productos en grupos de tres por tabla
      this.productChunks = this.chunkArray(this.products, 3);
    });
  }

  formatImageName(name:string){
    return name.replace(/ /g, "%20");
  }

  // Función para dividir un arreglo en grupos de un tamaño específico
  chunkArray(arr: AllProductsModel[], chunkSize: number): AllProductsModel[][] {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  exit() {
    this.authService.isLog = false;
    this.authService.token = "";
    this.route.navigate(["/login"]);
    this.cookieService.delete('token');
  }
}
