import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class RequestProductsService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any>{
    return this.http.get(`https://dummyjson.com/products`)
  }
  getProductById(id: number): Observable<any>{
    return this.http.get(`https://dummyjson.com/products/${id}`)
  }
}
