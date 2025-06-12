import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpService } from './http.service';
import { ApiResponse } from '../models';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: string[];
  lastLogin?: Date;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoint = '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpService) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.endpoint}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data);
          }
        })
      );
  }

  // Logout
  logout(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/logout`)
      .pipe(
        tap(() => {
          this.clearAuthData();
        })
      );
  }

  // Refresh token
  refreshToken(): Observable<ApiResponse<LoginResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<ApiResponse<LoginResponse>>(`${this.endpoint}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data);
          }
        })
      );
  }

  // Get current user profile
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.endpoint}/profile`);
  }

  // Update user profile
  updateProfile(profile: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.endpoint}/profile`, profile)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            localStorage.setItem('current_user', JSON.stringify(response.data));
          }
        })
      );
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  // Forgot password
  forgotPassword(email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/forgot-password`, { email });
  }

  // Reset password
  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/reset-password`, {
      token,
      newPassword
    });
  }

  // Verify email
  verifyEmail(token: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/verify-email`, { token });
  }

  // Get user permissions
  getUserPermissions(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.endpoint}/permissions`);
  }

  // Check if user has permission
  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.permissions?.includes(permission) || false;
  }

  // Check if user has role
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  // Get current user value
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if authenticated
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Set authentication data
  private setAuthData(loginResponse: LoginResponse): void {
    localStorage.setItem('auth_token', loginResponse.token);
    localStorage.setItem('refresh_token', loginResponse.refreshToken);
    localStorage.setItem('current_user', JSON.stringify(loginResponse.user));
    
    this.currentUserSubject.next(loginResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  // Clear authentication data
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Auto logout when token expires
  private autoLogout(expiresIn: number): void {
    setTimeout(() => {
      this.logout().subscribe();
    }, expiresIn * 1000);
  }
}

