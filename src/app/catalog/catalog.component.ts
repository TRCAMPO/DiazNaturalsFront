import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {AllProductsModel} from "./AllProductsModel";
import { CookieService } from "ngx-cookie-service";
import {cart} from "../cart/cart.model";
import {CategoryModel} from "../create-product/category.model";
import {PresentationsModel} from "../create-product/presentation.model";
import {SuppliersModel} from "../create-product/suppliers.model";
import {CartService} from "../cart/cart.service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  showCart: boolean = false;
  dataCart: cart[] = [];
  currentPage = 1;
  elementeForPage = 3;
  // @ts-ignore
  cartProduct: cart= null;
  // @ts-ignore
  private blob: Blob;
  products: AllProductsModel[] = [];
  productChunks: AllProductsModel[][] = [];
  filteredProducts: AllProductsModel[] = [];
  // @ts-ignore
  selectedProduct: AllProductsModel | null = null;

  // Filtros
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedPresentation: string = '';
  selectedProvider: string = '';
  selectedSort: string = 'asc'; // Por defecto, ordenar de menor a mayor

  // Valores para los filtros (categoría, presentación, proveedor)
  categories: CategoryModel[] = []; // Debes llenar esto con las categorías disponibles
  presentations: PresentationsModel[] = []; // Debes llenar esto con las presentaciones disponibles
  providers: SuppliersModel[] = []; // Debes llenar esto con los proveedores disponibles

  constructor(
    public authService: AuthService,
    public route: Router,
    public cookieService: CookieService,
    private toast: ToastrService,
    private cartService: CartService
  ) {
  }

  ngOnInit() {
    this.authService.getAllProductsActive().subscribe((response) => {
      this.products = response;
      this.products.forEach(imgProduct => {
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
    this.authService.getCategories().subscribe(data => {
      this.categories = data;
    });
    this.authService.getPresentation().subscribe(data => {
      this.presentations = data;
    });
    this.authService.getSuppliers().subscribe(data => {
      this.providers = data;
    });
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

    // Aplicar filtro por categoría
    if (this.selectedCategory !== '') {
      console.log(this.selectedCategory);
      this.filteredProducts = this.filteredProducts.filter(product => product.category === this.selectedCategory);
    }

    // Aplicar filtro por presentación
    if (this.selectedPresentation !== '') {
      this.filteredProducts = this.filteredProducts.filter(product => product.presentation === this.selectedPresentation);
    }

    // Aplicar filtro por proveedor
    if (this.selectedProvider !== '') {
      this.filteredProducts = this.filteredProducts.filter(product => product.supplier === this.selectedProvider);
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

  toggleCart() {
    this.showCart = !this.showCart; // Cambiar el valor de showCart al hacer clic en el botón
  }
  onCartClosed(event: any) {
    // Realiza las acciones necesarias cuando se cierra el carrito
    this.showCart = false; // Cerrar el carrito
  }
    addModel(item: AllProductsModel){
    const newCartProduct: cart = {
      name: item.name,
      image: item.imageNewUrl,
      presentation: item.presentation,
      price: item.price,
      quantity: 1,
      supplier: item.supplier
    };
    this.toast.success("Se ha agregado el producto correctamente", "Producto Añadido");
    this.addOrUpdateProductToCart(newCartProduct);
  }
  addOrUpdateProductToCart(product: cart) {
    const data = localStorage.getItem('products');
    if (data) {
      this.dataCart = JSON.parse(data);
    }else{
      this.dataCart=[];
    }
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
    this.cartService.cartUpdated$.next();
  }

  // Cuando el usuario hace clic en un producto para ver los detalles
  showProductDetails(product: AllProductsModel) {
    this.selectedProduct = product;
  }

  closeProductInformation() {
    this.selectedProduct = null;
  }
}
