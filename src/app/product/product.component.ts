import { RequestProductsService } from './../services/request-products.service';
import { Component} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../interfaces/product';
import { CurrencyPipe } from '@angular/common';
import { RequestUserService } from '../services/request-user.service';


@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent{
  product: Product = {} as Product;

  constructor(private route: ActivatedRoute, private productsService: RequestProductsService, private userService: RequestUserService, private router: Router) { }

  ngOnInit(){
    const id = this.route.snapshot.params['id'];
    this.productsService.getProductById(id).subscribe(res => {
      if (res.status && res.status === 'success'){
        this.product = res.data;
      }
      else {
        this.router.navigate(['/404'])
      }
    })
  }



  callOwner(product: Product) {
    this.userService.contactWith(product.createdBy).subscribe(res => {
      if (res.status && res.status === 'success') {
        window.open(`https://wa.me/${res.data}`, '_blank');
      }
      else {
        this.router.navigate(['/404'])
      }
     });
  }
}
