import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product: Product = {} as Product;
  @Input() canDelete: boolean = false;
  @Output() callOwner = new EventEmitter<any>();
  @Output() deleteProduct = new EventEmitter<any>();

  constructor(private router: Router) {}


  handleCardClick(event: Event) {
    this.router.navigate(['product', this.product._id]);
  }
}
