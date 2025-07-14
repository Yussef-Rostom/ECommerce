import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { StarRatingPipe } from '../../pipes/starRating/star-rating.pipe';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-product',
  imports: [CommonModule, StarRatingPipe, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product: Product = {} as Product;
  stars;
  rating=3.5;
  constructor(){
    this.stars = Array(5).fill(0).map((_, i) => {
      const starValue = i + 1;
      return {
        filled: starValue <= this.rating,
        half: (this.rating % 1 > 0) && (Math.ceil(this.rating) === starValue)
      };
    });
  }
}
