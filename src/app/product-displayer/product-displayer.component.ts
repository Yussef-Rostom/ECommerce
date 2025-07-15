import { Component } from '@angular/core';
import { products } from '../../../public/products.json'
import { Product } from '../interfaces/product';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-product-displayer',
  imports: [ProductComponent],
  templateUrl: './product-displayer.component.html',
  styleUrl: './product-displayer.component.css'
})
export class ProductDisplayerComponent {
  products: Product[] = products;
  onAddToCart(product: any) {
    // Your add to cart logic
    console.log('Product added to cart:', product);
  }

}
