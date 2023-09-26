
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
  elementeForPage = 2;
  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef)  {

  }
  ngOnInit() {
    const cartItemsJSON = localStorage.getItem('products');
    if (cartItemsJSON) {
      this.products = JSON.parse(cartItemsJSON);
    }
  }
  ngAfterViewInit() {
  }

  onQuantityChange( item: any) {
    if (item.quantity < 0) {
      item.quantity = 0;
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

}
