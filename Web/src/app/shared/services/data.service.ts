import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
// import { AuthService } from './auth.service';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {

    _base_Url: string = null;
    _base_Url2:string=null;
    constructor(private http: HttpClient, private config_service: ConfigService, private authService: AuthService) {
        this._base_Url = config_service.getApiUrl();
        this._base_Url2 = config_service.getApiUrl2();
    }

    /** GET All */
    GetAll(url: string): Observable<any> {
        // 
        return this.http.get<any>(this._base_Url + url)
            .pipe(
                tap(data => { return data; }),
                catchError(this.handleError)
            );
    }

    /** GET By Id */
    Get(url: string, id: any): Observable<any> {
        return this.http.get<any>(this._base_Url + url + '/' + id)
            .pipe(
                tap(data => { return data; }),
                catchError(this.handleError)
            );
    }

    /** POST */
    Post(url: string, req: any): Observable<any> {
        return this.http.post<any>(this._base_Url + url, req, httpOptions)
            .pipe(
                tap(data => { return data; }),
                catchError(this.handleError)
            );
    }

    /** DELETE */
    Delete(url: string, id: any): Observable<any> {
        return this.http.delete<any>(this._base_Url + url + '/' + id)
            .pipe(
                tap(data => { return data; }),
                catchError(this.handleError)
            );
    }

    /** PUT */
    Put(url: string, req: any): Observable<any> {
        return this.http.put(this._base_Url + url, req, httpOptions)
            .pipe(
                tap(data => { return data; }),
                catchError(this.handleError)
            );
    }

    /** POST */
    PostFiles(url: string, req: any): Observable<any> {
        return this.http.post<any>(this._base_Url + url, req)
            .pipe(
                tap(data => { return data; }),
                catchError(this.handleError)
            );
    }

    GetDownloadFile(url: string) : Observable<any> {
        return this.http.get(this._base_Url + url, { responseType: 'blob' })
        .pipe(
            tap(data => { return data; }),
            catchError(this.handleError)
        );
    }

    PostDownloadFile(url: string, req: any): Observable<any> {
        var options: any = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            responseType: 'blob'
        }

        //var options = new HttpHeaders({ 'Content-Type': 'application/json' })
        return this.http.post(this._base_Url + url, req, options)
            .pipe(
                tap(data => { return data; }),
                catchError(this.handleError)
            );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param error - error object
     */

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
        //   console.error(
        //     `Backend returned code ${error.status}, ` +
        //     `body was: ${error.error}`);
            console.log(error);
        }
        // return an observable with a user-facing error message
        return throwError(error);
      };
}
