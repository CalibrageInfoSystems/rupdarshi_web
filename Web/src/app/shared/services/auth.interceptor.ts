import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authService: AuthService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));        
        if (currentUser && currentUser.access_token) {            
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.access_token}`
                }
            });
        }
        return next.handle(request).pipe(catchError((error: any, caught: Observable<HttpEvent<any>>)=>{
            if(error.status == 401) {
                this.authService.logout();
                this.router.navigate(['/home']);
                return of(error);
            }
            throw error;
        }));
    }
}




// export class AuthInterceptor implements HttpInterceptor {
//     constructor(public auth: AuthService) {}
//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         // add authorization header with jwt token if available
//         let currentUser = JSON.parse(localStorage.getItem('currentUser'));        
//         if (currentUser && currentUser.access_token) {            
//             request = request.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${currentUser.access_token}`
//                 }
//             });
//         }
//         return next.handle(request);
//     }
// }
