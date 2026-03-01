import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
  success?: boolean;
  user?: {
    id: number;
    email?: string;
    username?: string;
    name?: string;
    fullName?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post<{success: boolean, data: AuthResponse}>(`${this.apiUrl}/auth/login`, loginData)
      .pipe(
        map(res => {
          const response = res.data;
          if (response.token) {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('authToken', response.token);
              if (response.user) {
                const normalizedUser = {
                  ...response.user,
                  email: response.user.email || response.user.username,
                  name: response.user.name || response.user.fullName || response.user.username
                };
                localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
                this.currentUserSubject.next(normalizedUser);
              }
            }
            response.success = true;
          }
          return response;
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const backendData = {
      username: data.email,
      name: data.name,
      email: data.email,
      password: data.password
    };

    return this.http.post<{success: boolean, data: AuthResponse}>(`${this.apiUrl}/auth/register`, backendData)
      .pipe(
        map(res => {
          const response = res.data;
          if (response.token || (response as any).id) {
            if (response.token && typeof localStorage !== 'undefined') {
              localStorage.setItem('authToken', response.token);
              if (response.user) {
                const normalizedUser = {
                  ...response.user,
                  email: response.user.email || response.user.username,
                  name: response.user.name || response.user.fullName || response.user.username
                };
                localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
                this.currentUserSubject.next(normalizedUser);
              }
            }
            response.success = true;
          }
          return response;
        })
      );
  }

  logout(): void {
    // Remove token and user from localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem('authToken');
  }

  private getUserFromStorage(): any {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}
