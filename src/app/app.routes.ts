import { Routes } from '@angular/router';
import { ProductDisplayerComponent } from './product-displayer/product-displayer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductComponent } from './product/product.component';
import { AddProductComponent } from './add-product/add-product.component';

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
    path: 'product/:id',
    component: ProductComponent,
    title: "Product Page"
  },
  {
    path: 'product',
    component: AddProductComponent,
    title: " Add Product Page"
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: "Not found page"
  }
];
