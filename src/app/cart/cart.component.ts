
import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  OnInit, ChangeDetectorRef, EventEmitter, Output
} from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationControlsDirective } from 'ngx-pagination';

import {cart} from "./cart.model";
import {CartService} from "./cart.service";
import {ConfirmDialogComponent} from "../confirm-dialog-edit-product/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogCreateOrderComponent} from "../confirm-dialog-create-order/confirm-dialog-create-order.component";
import {Router} from "@angular/router";
import {ConfirmDialogComponentDeleteProduct} from "../confirm-dialog-delete-product/confirm-dialog.component";
import {AuthService} from "../auth.service";
import {SearchProductModel} from "../confirm-dialog-delete-product/searchProductModel";
import {ToastrService} from "ngx-toastr";
import {mergeMap, Observable} from "rxjs";
import {OrdersModelNew} from "./OrdersModelNew";
import {CookieService} from "ngx-cookie-service";
import {UserModelClient} from "../create-user/userClient.model";
import {ProductsOrderModel} from "./productsOrder.model";
import {AllProductsModel} from "../catalog/AllProductsModel";
import {ProductModel} from "../create-product/product.model";
//import {ResisableComponentService} from "../resisable-component.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  // encapsulation: ViewEncapsulation.Emulated,
})
export class CartComponent implements AfterViewInit, OnInit{
  @Input() cartStyles: any;
  @ViewChild('container') container: ElementRef | undefined;
  products: cart[] = [];
  allProducts:ProductModel[] = []
  currentPage = 1;
  elementeForPage = 3;
  user:UserModelClient = new UserModelClient();

  @Output() closeCart: EventEmitter<void> = new EventEmitter<void>();
  constructor(private cookies:CookieService, private renderer: Renderer2, private cdr: ChangeDetectorRef, private cartService: CartService, public dialog: MatDialog, public authService: AuthService,private toast: ToastrService, public router: Router)  {
    this.authService.formDataSearchProduct = new SearchProductModel();
  }
  ngOnInit() {
    this.cartService.cartUpdated$.subscribe(() => {
      this.updateCart();
    });
    const cartItemsJSON = localStorage.getItem('products');
    if (cartItemsJSON) {
      this.products = JSON.parse(cartItemsJSON);
    }
    this.authService.getUserByEmail(this.cookies.get("email")).subscribe(
      (user) => {
        this.user = user;
      });
    this.authService.getAll2Products().subscribe((data) =>{
      this.allProducts = data;
    });
  }
  ngAfterViewInit() {
  }

  onQuantityChange( item: any) {
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    if (item.quantity > 100) {
      item.quantity = 100;
    }
    this.updateQuantity(item.quantity, item.name, item.supplier, item.presentation);
    this.all();
    this.cdr.detectChanges();
  }
  updateQuantity(numero: number, name:string, supplier:string, presentation:string){
    const cartItemsJSON = localStorage.getItem('products');
    if (cartItemsJSON) {
      let products = JSON.parse(cartItemsJSON);
      // @ts-ignore
      const itemIndex = products.findIndex(item => {
          return item.name === name && item.supplier === supplier && item.presentation === presentation;
        }
      );
      if (itemIndex !== -1) {
        products[itemIndex].quantity = numero;
        localStorage.setItem('products', JSON.stringify(products));
        this.all();
      }
    }
    this.all();
  }

  deleteproduct(name:string, supplier:string, presentation:string){
    console.log("aqui llego");
    const cartItemsJSON = localStorage.getItem('products');
    if (cartItemsJSON) {
      let products = JSON.parse(cartItemsJSON);
      // @ts-ignore
      const itemIndex = products.findIndex(item =>
        item.name === name && item.supplier === supplier && item.presentation === presentation
      );
      if (itemIndex !== -1) {
        products.splice(itemIndex, 1);
        localStorage.setItem('products', JSON.stringify(products));
        const cartItemsJSON = localStorage.getItem('products');
        if (cartItemsJSON) {
          this.products = JSON.parse(cartItemsJSON);
        }
        if ((this.currentPage ) * this.elementeForPage >= this.products.length) {
          this.currentPage--;
          if (this.currentPage < 1) {
            this.currentPage = 1;
          }
        }
        this.updateCart();
        this.all();
      }
    }
  }

  all(): number {
    let value = 0;
    for (const item of this.products) {
      value += item.quantity * item.price;
    }
    return value;
  }

  updateCart() {
    // Vuelve a obtener los productos del carrito desde localStorage
    const cartItemsJSON = localStorage.getItem('products');
    if (cartItemsJSON) {
      this.products = JSON.parse(cartItemsJSON);
    }
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogCreateOrderComponent, {
      panelClass: 'custom-dialog-overlay',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const correctOrder = await this.check();
          if (correctOrder) {

            const productsOrderArray: ProductsOrderModel[] = this.products.map((cartItem) => {
              const productOrderItem = new ProductsOrderModel();

              // Utilizamos 'filter' para encontrar el objeto en 'allProducts' que coincida con 'image'
              const matchingProduct = this.allProducts.filter(product => product.name === cartItem.name)[0];

              // Si encontramos un objeto coincidente, asignamos el 'idProduct' a 'productOrderItem.productId'
              if (matchingProduct) {
                productOrderItem.productId = matchingProduct.idProduct;
              } else {
                // Manejar el caso en el que no se encuentra un producto coincidente
                console.error(`No se encontró un producto para la imagen ${cartItem.image}`);
              }

              productOrderItem.quantity = cartItem.quantity;

              return productOrderItem;
            });
            let sendOrder: OrdersModelNew = new OrdersModelNew();
            sendOrder.addCart = productsOrderArray;
            sendOrder.idClient = this.user.idClient;
            sendOrder.totalPriceOrder = this.all();
            sendOrder.startDateOrder = new Date();

            this.authService.postOrder(sendOrder).subscribe(
              (response) => {
                // Manejar la respuesta exitosa aquí
                console.log('Respuesta exitosa:', response);
              },
              (error) => {
                // Manejar el error aquí
                console.error('Error en la solicitud:', error);
              }
            );
            localStorage.removeItem('products');
            this.products=[];
            this.all();
            this.closeCart.emit();
            this.router.navigate(['/listOrdersUser']);
          }
        }catch (error){

        }
      } else {
      }
    });
  }
 async check():Promise<boolean> {
    const cartItemsJSON = localStorage.getItem('products');
    if (cartItemsJSON) {
      let products = JSON.parse(cartItemsJSON);
      // @ts-ignore
      for (const p of products) {
        this.authService.formDataSearchProduct.search = p.name;
        this.authService.formDataSearchProduct.suppliers = p.supplier;
        this.authService.formDataSearchProduct.presentation = p.presentation;
        try {
          await this.searchProduct().toPromise();
        } catch (error) {
          this.toast.error("Producto "+ this.authService.formDataSearchProduct.search+ " no encontrado", "Error");
          console.log("borrando...")
          this.deleteproduct(p.name, p.supplier, p.presentation);
          return false;
        }
      }
    }return true;
  }
  searchProduct(): Observable<any> {
    return this.authService.getProductByNamePresentationSupplier(this.authService.formDataSearchProduct);
  }

}
