import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RequestUserService {

  endPointUrl:string = 'http://localhost:3000/api/users'

  constructor(private http: HttpClient, private router: Router) { }

  getMyProfile(token: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.endPointUrl}/me`, { headers });
  }

  register(user: User): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.endPointUrl}/register`, user, { headers });
  }

  login(user: any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.endPointUrl}/login`, user, { headers });
  }

  logout(token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(`${this.endPointUrl}/logout`, {headers})
  }

  contactWith(id: string): Observable<any>{
    return this.http.get(`${this.endPointUrl}/contact/${id}`).pipe(
      catchError(error => {
        if (error.status) {
          this.router.navigate(['/404']);
        }
        return throwError(error);
      })
    );
  }
}
