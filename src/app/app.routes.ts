import { Routes } from '@angular/router';
import { ProductDisplayerComponent } from './product-displayer/product-displayer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductComponent } from './product/product.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductDisplayerComponent,
    title: "Home page"
  },
  {
    path: 'login',
    component: LoginComponent,
    title: "Login page"
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: "Register page"
  },
  {
    path: 'cart',
    component: CartComponent,
    title: "Cart page"
  },
  {
    path: 'product/:id',
    component: ProductComponent,
    title: "Product Page"
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: "Not found page"
  }
];
