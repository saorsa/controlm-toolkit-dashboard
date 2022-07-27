import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import {
  CtmNodeInfo, CtmNodeStat, CtmServerStats
} from "./model/ctm-server.model";


export type ApiQueryParams = HttpParams | {
  [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected readonly backend = environment.backend

  constructor(
    readonly httpClient: HttpClient
  ) {
  }

  getAllServerNames(): Observable<string[]> {
    return this.get<string[]>("server-names");
  }

  getServerStats(server: string): Observable<CtmServerStats> {
    return this.get<CtmServerStats>(`servers/${server}/stats`);
  }

  getNodeStats(server: string): Observable<{ [key in string]: CtmNodeStat }> {
    return this.get<{ [key in string]: CtmNodeStat }>(`servers/${server}/nodes/stats`);
  }

  getNodeDetails(server: string, host: string): Observable<CtmNodeInfo> {
    return this.get<CtmNodeInfo>(`servers/${server}/node/${host}`);
  }

  getAllNodeNames(server: string): Observable<string[]> {
    return this.get<string[]>(`servers/${server}/nodes`);
  }

  protected get<T>(path: string, queryParams: ApiQueryParams | null = null) : Observable<T> {
    const result = queryParams != null ?
      this.httpClient.get<T>(`${this.backend}/${path}`, { params: queryParams }) :
      this.httpClient.get<T>(`${this.backend}/${path}`);

    result.pipe(
      catchError(this.handleApiError)
    )

    return result;
  }

  protected handleApiError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('API Service Network Error (0)', error.error);
    } else {
      console.error(
        `API Service Error ${error.status}. Result is: `, error.error);
    }
    return throwError(() => error);
  }
}
