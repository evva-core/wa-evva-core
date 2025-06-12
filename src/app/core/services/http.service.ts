import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { Observable, from } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Configure retry logic
    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               (error.response?.status ? error.response.status >= 500 : false);
      }
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(
      this.axiosInstance.get<T>(url, config).then(response => response.data)
    );
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return from(
      this.axiosInstance.post<T>(url, data, config).then(response => response.data)
    );
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return from(
      this.axiosInstance.put<T>(url, data, config).then(response => response.data)
    );
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return from(
      this.axiosInstance.patch<T>(url, data, config).then(response => response.data)
    );
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(
      this.axiosInstance.delete<T>(url, config).then(response => response.data)
    );
  }

  // Method to get raw axios response
  getRaw<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return from(this.axiosInstance.get<T>(url, config));
  }

  postRaw<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return from(this.axiosInstance.post<T>(url, data, config));
  }
}

