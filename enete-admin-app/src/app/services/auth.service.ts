//private authUrl = environment.apiUrl
//import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private authUrl = environment.apiUrl
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(login_name: string, password: string): Observable<any> {
    return this.http.post<{ access_token: string }>(`${this.authUrl}/auth/login`, { login_name, password }).pipe(
      tap(tokens => {
          
        this.storeToken(tokens['access_token']);
      })
    );
  }

  refreshToken(): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    return this.http.post<{ access_token: string }>(`${this.authUrl}/auth/refresh`, { token }).pipe(
      tap(tokens => {
        this.storeToken(tokens['access_token']);
      }),
      catchError(error => {
        this.logout();
        this.router.navigate(['/login']);
        return throwError(error);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  private storeToken(accessToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
    }
    
    this.tokenSubject.next(accessToken);
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.role === 'admin';
  }
}