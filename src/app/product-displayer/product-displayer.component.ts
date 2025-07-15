import { CartService } from './../services/cart.service';
import { RequestProductsService } from './../services/request-products.service';
import { Component } from '@angular/core';
import { Product } from '../interfaces/product';
import { products } from '../../../public/products.json';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-product-displayer',
  imports: [ProductComponent],
  templateUrl: './product-displayer.component.html',
  styleUrl: './product-displayer.component.css'
})
export class ProductDisplayerComponent {
  products: Product[] = [];

  constructor(private requestProductsService: RequestProductsService, private cartService: CartService) { }
  ngOnInit(){
    this.requestProductsService.getProducts().subscribe(res => { this.products = res.products });
  }
  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

}
