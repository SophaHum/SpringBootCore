import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Generic POST request
   * @param endpoint The endpoint path
   * @param data The request body
   * Usage: this.apiService.post<User>('users', userdata)
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data).pipe(
      map(res => res.data)
    );
  }

  /**
   * Generic PUT request
   * @param endpoint The endpoint path
   * @param data The request body
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data).pipe(
      map(res => res.data)
    );
  }

  /**
   * Generic DELETE request
   * @param endpoint The endpoint path
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Generic PATCH request
   * @param endpoint The endpoint path
   * @param data The request body
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data).pipe(
      map(res => res.data)
    );
  }

  /**
   * EXAMPLE: Toggle user status
   * Usage: this.apiService.toggleUserStatus(1)
   */
  toggleUserStatus(id: number): Observable<any> {
    return this.patch(`users/${id}/toggle-status`, {});
  }

  /**
   * Fetch dashboard statistics
   */
  getDashboardStats(): Observable<any> {
    return this.get('dashboard/stats');
  }

  /**
   * Fetch recent dashboard activity
   */
  getDashboardActivity(): Observable<any> {
    return this.get('dashboard/activity');
  }

  /**
   * Fetch all roles
   */
  getRoles(): Observable<any[]> {
    return this.get('roles');
  }

  /**
   * Fetch all permissions
   */
  getPermissions(): Observable<any[]> {
    return this.get('permissions');
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
    // Adding trailing slash to match documentation in README.md Section 7
    return this.get('users/');
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
