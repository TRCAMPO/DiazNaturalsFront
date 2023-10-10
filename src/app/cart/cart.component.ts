
import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  OnInit, ChangeDetectorRef
} from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationControlsDirective } from 'ngx-pagination';

import {cart} from "./cart.model";
import {CartService} from "./cart.service";
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
  currentPage = 1;
  elementeForPage = 3;
  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef, private cartService: CartService)  {

  }
  ngOnInit() {
    this.cartService.cartUpdated$.subscribe(() => {
      this.updateCart();
    });
    const cartItemsJSON = localStorage.getItem('products');
    if (cartItemsJSON) {
      this.products = JSON.parse(cartItemsJSON);
    }
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
          const ds= (this.currentPage - 1) * this.elementeForPage >= this.products.length;
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
}
