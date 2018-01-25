import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StringMap, FileMap } from '@syndesis/ui/platform';

export declare type Endpoints = StringMap<string>;

export const API_ENDPOINTS = new InjectionToken('API_ENDPOINTS');

export interface ApiErrorMessage {
  developerMsg?: string;
  userMsg?: string;
  userMsgDetail?: string;
  errorCode?: number;
}

export interface ApiErrors {
  errors?: {
    status: number;
    statusText: string;
    messages: Array<ApiErrorMessage>;
  };
}

export interface ApiResponse extends ApiErrors {
  readonly id?: string;
  kind?: string;
}

export interface ApiEndpoint {
  url: string;
  get<T>(): Observable<T>;
  post<T>(payload: any): Observable<T>;
  put<T>(payload: any): Observable<T>;
  delete<T>(payload?: any): Observable<T>;
  upload<T>(fileMap?: FileMap, body?: StringMap<any>, verb?: 'POST'|'PUT'): Observable<T>;
}

export interface ApiRequestProgress {
  percentage: number;
  isComplete: boolean;
  bytesLoaded?: number;
  bytesTotal?: number;
}
