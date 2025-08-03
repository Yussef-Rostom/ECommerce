import { RequestProductsService } from './../services/request-products.service';
import { Component} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../interfaces/product';
import { CurrencyPipe } from '@angular/common';
import { RequestUserService } from '../services/request-user.service';
import { LocalStorageService } from '../services/local-storage.service';


@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent{
  product: Product = {} as Product;
  userId: string = "";
  token: string = "";
  message: string = "";
  isAdmin: boolean = false;
  timer: any;
  interval: any;

  constructor(private route: ActivatedRoute, private productsService: RequestProductsService, private userService: RequestUserService, private router: Router, private localStorageService: LocalStorageService) { }

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

  canDelete(): boolean{
    return (this.userId==this.product.createdBy || this.isAdmin);
  }

  deleteProduct(productId: string){
    let remTime = 10;
    this.message = `the product will deleted after ${remTime--} seconds`;
    this.interval = setInterval(()=>{
      this.message = `the product will deleted after ${remTime--} seconds`;
    }, 1000)

    this.timer = setTimeout(() => {
      this.message = "";
      clearInterval(this.interval);
      this.productsService.deleteProduct(productId, this.token).subscribe({
        next: (res) => {
          this.router.navigate(['/'])
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
    clearInterval(this.interval);
    this.message = "";
  }
}
