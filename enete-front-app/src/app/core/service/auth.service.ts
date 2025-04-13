import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    // Simulierte API (ersetze durch echtes Backend)
    return of({ access_token: 'fake-token' }).pipe(
      map((response) => {
        localStorage.setItem('token', response.access_token);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
