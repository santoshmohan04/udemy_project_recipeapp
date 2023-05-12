import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { take, exhaustMap, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map((authState) => {
        return authState.user;
      }),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(modifiedReq).pipe(
          tap({
            next: () => {},
            error: (err: HttpErrorResponse) => {
              console.log(err.status, err.statusText);
              if (err.status === 401 && err.statusText === 'Unauthorized') {
                this.store.dispatch(new AuthActions.Logout());
              }
            },
          })
        );
      })
    );
  }
}
