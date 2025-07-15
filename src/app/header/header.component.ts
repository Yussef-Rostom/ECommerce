import { CartService } from './../services/cart.service';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartItemsCount: number = 0;
  constructor(private cartService: CartService) { }

  ngOnInit(){
    this.cartService.cartItemsCount.subscribe(res => { this.cartItemsCount=res })
  }
}
