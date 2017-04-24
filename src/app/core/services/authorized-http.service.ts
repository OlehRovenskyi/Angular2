import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response,
  XHRBackend
} from '@angular/http';
import { AuthTokenService } from './auth-token.service';

@Injectable()
export class AuthorizedHttpService extends Http {
  private authToken: AuthTokenService;

  constructor (backend: XHRBackend, options: RequestOptions, authToken: AuthTokenService) {
    options.headers.set('Authorization', `${ authToken.getToken() }`);

    super(backend, options);

    this.authToken = authToken;
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (typeof url === 'string') {
      if (!options) {
        options = { headers: new Headers() };
      }

      options.headers.set('Authorization', `${ this.authToken.getToken() }`);
    } else {
      url.headers.set('Authorization', `${ this.authToken.getToken() }`);
    }

    return super.request(url, options).catch(this.catchAuthError(this));
  }

  private catchAuthError (self: AuthorizedHttpService) {
    return (res: Response): Observable<Response> => {
      console.log(res);

      if (res.status === 401 || res.status === 403) {
        console.log(res);
      }

      return Observable.throw(res);
    };
  }
}
