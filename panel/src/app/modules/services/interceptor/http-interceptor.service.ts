import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { StateService } from './../state.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private stateService: StateService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.stateService.startLoading();
    req = req.clone({
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization',
        'Access-Control-Allow-Methods':'GET, POST, OPTIONS, PUT, DELETE, PATCH'
      })
    });
    return next.handle(req).pipe(
      tap((event) => { }),
      finalize(() => {

        setTimeout(() => { this.stateService.endLoading(); }, 1000);

      })
    );
  }
}
