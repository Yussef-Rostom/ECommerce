import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { products } from '../../../public/products.json'
import { Product } from '../interfaces/product';
import { StarRatingPipe } from '../pipes/starRating/star-rating.pipe';


@Component({
  selector: 'app-product',
  imports: [StarRatingPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent{
  product: Product = {} as Product;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(){
    const id = +this.route.snapshot.params['id'];
    this.product = products.find(product=> product.id === id) || {} as Product;
  }
}
