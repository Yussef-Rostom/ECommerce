import { CartService } from './../services/cart.service';
import { Component } from '@angular/core';
import { Product } from '../interfaces/product';
import { StarRatingPipe } from '../pipes/starRating/star-rating.pipe';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [StarRatingPipe, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cart: Map<Product, Number> = new Map<Product, number>();

  constructor(private router: Router,  private cartService: CartService) { }

  ngOnInit(){
    this.cartService.cart.subscribe(res => this.cart = res)
  }

  get cartItems() {
    return Array.from(this.cart.entries()).map(([product, quantity]) => ({
      product,
      quantity
    }));
  }

  addToCart(product: Product){
    this.cartService.addToCart(product);
  }
  RemoveFromCart(product: Product){
    this.cartService.RemoveFromCart(product);
  }

  handleCardClick(event: Event, id: number) {
    if (!this.isClickOnButton(event)) {
      this.router.navigate(['product', id]);
    }
  }
  private isClickOnButton(event: Event): boolean {
    return (event.target as HTMLElement).closest('button') !== null;
  }

}
