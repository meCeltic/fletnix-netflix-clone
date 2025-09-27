import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    age: number;
  };
}

export interface RegisterResponse {
  success?: boolean;
  message: string;
  token?: string;
  user?: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    age: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    const user = this.storageService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('AuthService received response:', response);
          if (response.token) {
            this.storageService.setToken(response.token);
            if (response.user) {
              this.storageService.setUser(response.user);
              this.currentUserSubject.next(response.user);
              console.log('User stored in AuthService:', response.user);
            }
          }
        })
      );
  }

  register(userData: { name: string; email: string; password: string; age: number }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.token) {
            this.storageService.setToken(response.token);
            if (response.user) {
              this.storageService.setUser(response.user);
              this.currentUserSubject.next(response.user);
            }
          }
        })
      );
  }

  logout(): void {
    this.storageService.clearAll();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.storageService.getToken();
    if (!token) {
      console.log('No token found');
      return false;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const isValid = Date.now() < expiry;
      console.log('Token validation:', isValid, 'Expires:', new Date(expiry));
      return isValid;
    } catch (error) {
      console.log('Token validation error:', error);
      return false;
    }
  }

  getCurrentUser(): any {
    const user = this.storageService.getUser();
    console.log('Getting current user:', user);
    return user;
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }
}
