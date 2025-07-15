import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { StarRatingPipe } from '../../pipes/starRating/star-rating.pipe';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product',
  imports: [CommonModule, StarRatingPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product: Product = {} as Product;
  @Output() addToCart = new EventEmitter<any>();

  constructor(private router: Router) {}

  handleCardClick(event: Event) {
    if (!this.isClickOnButton(event)) {
      this.router.navigate(['product', this.product.id]);
    }
  }

  private isClickOnButton(event: Event): boolean {
    return (event.target as HTMLElement).closest('button') !== null;
  }
}
