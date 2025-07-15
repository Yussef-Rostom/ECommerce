import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart = new BehaviorSubject(new Map<Product, number>());
  itemsCount = new BehaviorSubject(0);

  constructor() { }

  get cartItemsCount(): Observable<number>{
    return this.itemsCount.asObservable();
  }

  addToCart(product: Product){
    this.itemsCount.next(this.itemsCount.value + 1);
    let currentCart = this.cart.value;
    currentCart.set(product, (currentCart.get(product) || 0) + 1);
    this.cart.next(currentCart)
  }
  RemoveFromCart(product: Product){
    let currentCart = this.cart.value;
    this.itemsCount.next(this.itemsCount.value - 1);
    currentCart.set(product, ((currentCart.get(product) || 0) - 1))
    if ((currentCart.get(product) || 0) < 1) currentCart.delete(product);
    this.cart.next(currentCart)
  }
}
