import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RequestProductsService {

  endPointUrl:string = 'https://used-market-ten.vercel.app/api/products'

  constructor(private http: HttpClient, private router: Router) { }

  getProducts(): Observable<any>{
    return this.http.get(`${this.endPointUrl}`).pipe(
      catchError(error => {
        if (error.status) {
          this.router.navigate(['/404']);
        }
        return throwError(error);
      })
    );
  }


  addProduct(data: FormData, token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.endPointUrl}`, data, { headers });
  }

  getProductById(id: number): Observable<any>{
    return this.http.get(`${this.endPointUrl}/${id}`).pipe(
      catchError(error => {
        if (error.status) {
          this.router.navigate(['/404']);
        }
        return throwError(error);
      })
    );
  }
}

