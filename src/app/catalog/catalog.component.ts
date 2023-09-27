import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {AllProductsModel} from "./AllProductsModel";
import { CookieService } from "ngx-cookie-service";
import {cart} from "../cart/cart.model";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  imageFile: File | null = null;
  imageUrl: string | null = null;
  showCart: boolean = false;
  dataCart: cart[] = [];
  // @ts-ignore
  cartProduct: cart= null;
  // @ts-ignore
  private blob: Blob;
  products: AllProductsModel[] = [];
  productChunks: AllProductsModel[][] = [];
  filteredProducts: AllProductsModel[] = [];

  // Filtros
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedPresentation: string = '';
  selectedProvider: string = '';
  selectedSort: string = 'asc'; // Por defecto, ordenar de menor a mayor

  // Valores para los filtros (categoría, presentación, proveedor)
  categories: string[] = []; // Debes llenar esto con las categorías disponibles
  presentations: string[] = []; // Debes llenar esto con las presentaciones disponibles
  providers: string[] = []; // Debes llenar esto con los proveedores disponibles

  constructor(
    public authService: AuthService,
    public route: Router,
    public cookieService: CookieService,
  ) {}

  ngOnInit() {
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
      this.productChunks = this.chunkArray(this.products, 3);
    });

    // Llena las categorías, presentaciones y proveedores disponibles
    this.categories = this.getUniqueValues(this.products.map(product => product.category));
    this.presentations = this.getUniqueValues(this.products.map(product => product.presentation));
    this.providers = this.getUniqueValues(this.products.map(product => product.supplier));
  }

  // Función para obtener valores únicos de una lista
  getUniqueValues(arr: string[]): string[] {
    return Array.from(new Set(arr));
  }

  // Aplica los filtros y actualiza la lista de productos filtrados
  applyFilters() {
    this.filteredProducts = this.products
      .filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.selectedCategory === '' || product.category === this.selectedCategory) &&
        (this.selectedPresentation === '' || product.presentation === this.selectedPresentation) &&
        (this.selectedProvider === '' || product.supplier === this.selectedProvider)
      );

    if (this.selectedSort === 'asc') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === 'desc') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Divide los productos filtrados en grupos de tres por tabla
    this.productChunks = this.chunkArray(this.filteredProducts, 3);
  }

  formatImageName(name:string){
    return name.replace(/ /g, "%20");
  }

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
  toggleCart() {
    this.showCart = !this.showCart; // Cambiar el valor de showCart al hacer clic en el botón
  }
  addModel(item: AllProductsModel){
    console.log(item)
    const newCartProduct: cart = {
      name: item.name,
      image: item.imageNewUrl,
      presentation: item.presentation,
      price: item.price,
      quantity: 1,
      supplier: item.supplier
    };
    console.log(newCartProduct)
    this.addOrUpdateProductToCart(newCartProduct);
  }
  addOrUpdateProductToCart(product: cart) {
    const existingProductIndex = this.dataCart.findIndex(item =>
      item.name === product.name &&
      item.supplier === product.supplier &&
      item.presentation === product.presentation
    );
    if (existingProductIndex !== -1) {
      this.dataCart[existingProductIndex].quantity += product.quantity;
    } else {
      this.dataCart.push(product);
    }
    const cartItemsJSON = JSON.stringify(this.dataCart);
    localStorage.setItem('products', cartItemsJSON);
    console.log(this.dataCart);
    console.log(this.dataCart.length);
  }
}
