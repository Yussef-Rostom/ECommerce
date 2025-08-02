import { RequestProductsService as productsService } from './../services/request-products.service';
import { Component } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductComponent } from './product/product.component';
import { Router } from '@angular/router';
import { RequestUserService } from '../services/request-user.service';

@Component({
  selector: 'app-product-displayer',
  imports: [ProductComponent],
  templateUrl: './product-displayer.component.html',
  styleUrl: './product-displayer.component.css'
})
export class ProductDisplayerComponent {
  products: Product[] = [];

  constructor(private requestProductsService: productsService, private userService: RequestUserService, private router: Router) { }
  ngOnInit(){
    this.requestProductsService.getProducts().subscribe(res => {
      this.products = res.data;
    });
  }

  callOwner(product: Product) {
    this.userService.contactWith(product.createdBy).subscribe(res => {
      if (res.status && res.status === 'success') {
        window.open(`https://wa.me/+2${res.data}`, '_blank');
      }
      else {
        this.router.navigate(['/404'])
      }
     });
  }
}
