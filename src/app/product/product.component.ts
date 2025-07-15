import { RequestProductsService } from './../services/request-products.service';
import { Component} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../interfaces/product';
import { StarRatingPipe } from '../pipes/starRating/star-rating.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-product',
  imports: [StarRatingPipe, CurrencyPipe, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent{
  product: Product = {} as Product;

  constructor(private route: ActivatedRoute, private requestProductsService: RequestProductsService, private cartService: CartService) { }

  ngOnInit(){
    const id = +this.route.snapshot.params['id'];
    this.requestProductsService.getProductById(id).subscribe(res => {this.product = res})
  }


  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
