import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private httpClient;
  private baseUrl='https://crudcrud.com/api/6aa0bc8628f9493d93d6dec1ba01f560/tech-active/';

  constructor(public http: HttpClient) {
    this.httpClient = http;
  }

  public getGroupList(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(
      map(response => {
        return response;
      }),
      catchError(ex => {
        return throwError((ex));
      })
    );
  }

  public addGroup(params:any): Observable<any> {
    return this.http.post<any>(this.baseUrl,params).pipe(
      map(response => {
        return response;
      }),
      catchError(ex => {
        return throwError((ex));
      })
    );
  }

  public updateGroup(id:any,params:any):Observable<any> {
    return this.http.put<any>(this.baseUrl+id,params).pipe(
      map(response => {
        return response;
      }),
      catchError(ex => {
        return throwError((ex));
      })
    );
  }

  public deleteGroup(id:any):Observable<any> {
    return this.http.delete<any>(this.baseUrl+id).pipe(
      map(response => {
        return response;
      }),
      catchError(ex => {
        return throwError((ex));
      })
    );
  }

}
