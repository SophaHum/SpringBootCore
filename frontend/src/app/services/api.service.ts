import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generic GET request
   * @param endpoint The endpoint path (e.g., 'users/profile')
   * Usage: this.apiService.get<User>('users/profile')
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  /**
   * Generic POST request
   * @param endpoint The endpoint path
   * @param data The request body
   * Usage: this.apiService.post<User>('users', userdata)
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  /**
   * Generic PUT request
   * @param endpoint The endpoint path
   * @param data The request body
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  /**
   * Generic DELETE request
   * @param endpoint The endpoint path
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }

  /**
   * EXAMPLE: Fetch user profile
   * Usage: this.apiService.getUserProfile()
   */
  getUserProfile(): Observable<any> {
    return this.get('users/profile');
  }

  /**
   * EXAMPLE: Fetch all users
   * Usage: this.apiService.getUsers()
   */
  getUsers(): Observable<any> {
    return this.get('users');
  }

  /**
   * EXAMPLE: Fetch user by ID
   * Usage: this.apiService.getUserById(1)
   */
  getUserById(id: number): Observable<any> {
    return this.get(`users/${id}`);
  }

  /**
   * EXAMPLE: Update user
   * Usage: this.apiService.updateUser(1, userData)
   */
  updateUser(id: number, data: any): Observable<any> {
    return this.put(`users/${id}`, data);
  }

  /**
   * EXAMPLE: Delete user
   * Usage: this.apiService.deleteUser(1)
   */
  deleteUser(id: number): Observable<any> {
    return this.delete(`users/${id}`);
  }
}
