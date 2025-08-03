import {RequestProductsService } from './../services/request-products.service';
import { Component } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductComponent } from './product/product.component';
import { Router } from '@angular/router';
import { RequestUserService } from '../services/request-user.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-product-displayer',
  imports: [ProductComponent],
  templateUrl: './product-displayer.component.html',
  styleUrl: './product-displayer.component.css'
})
export class ProductDisplayerComponent {
  products: Product[] = [];
  originalProducts: Product[] = [];
  userId: string = "";
  token: string = "";
  message: string = "";
  isAdmin: boolean = false;
  timer: any;
  interval: any;


  constructor(private productsService: RequestProductsService, private userService: RequestUserService, private router: Router, private localStorageService: LocalStorageService) { }

  ngOnInit(){
    this.productsService.getProducts().subscribe(res => {
      this.products = res.data;
    });
    this.localStorageService.watchStorage().subscribe({
      next: (change) => {
        this.refreshToken();
      },
      error: (err) => console.error('Storage watch error:', err)
    });
    this.refreshToken();
  }

  private refreshToken() {
    this.token = this.localStorageService.getItem('Authorization');
    if(this.token){
      this.userService.getMyProfile(this.token).subscribe(res =>{
        const data:any = res.data;
        if(data) {
          this.userId = data._id;
          this.isAdmin = data.role === 'ADMIN'
        }
      });
    }
    else this.userId = '';
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

  canDelete(product: Product): boolean{
    return (this.userId==product.createdBy || this.isAdmin);
  }

  deleteProduct(product: Product){
    let remTime = 10;
    this.message = `the product will deleted after ${remTime--} seconds`;
    this.interval = setInterval(()=>{
      this.message = `the product will deleted after ${remTime--} seconds`;
    }, 1000)

    this.originalProducts = this.products;
    this.products = this.products.filter(i => i._id != product._id);
    this.timer = setTimeout(() => {
      this.message = "";
      clearInterval(this.interval);
      this.productsService.deleteProduct(product._id, this.token).subscribe({
        next: (res) => {
          if(res.status == 'success'){
            console.log('deleted successfully')
          }
        },
        error: (err) => {
          console.error("can't delete this product", err)
          this.message = "can't delete this product";
          setTimeout(() => {
            this.message = "";
          }, 2000);
        }
      })

    }, 10000);

  }

  cancelDeletion(){
    clearTimeout(this.timer);
    clearInterval(this.interval)
    this.message = "";
    this.products = this.originalProducts;
  }
}
