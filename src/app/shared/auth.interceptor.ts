import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    protected router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthentificated()) {
      req = req.clone({
        setParams: {
          auth: this.auth.getToken()
        }
      })
    }

    return next.handle(req)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            this.auth.logout()
            this.router.navigate(['/admin', 'login'])
          }
          return throwError(error)
        })
      )
  }
}
