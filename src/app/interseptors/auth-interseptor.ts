import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {X_SUBSCRIPTION, X_TENANT} from '../constants/constants';
import {AccountManagementService} from '../services/account-management.service';
import {AuthService} from '../services/auth.service';

@Injectable()
export class SubscriptionInterceptor implements HttpInterceptor {

  public const;
  public XTENANT_EXCLUDED_URLS = [
    '/organization',
    '/myProfile',
  ];

  constructor(private accManagement: AccountManagementService, private authService: AuthService) {
  }

  public isXtenantForbidden(request: HttpRequest<any>): boolean {
    return this.XTENANT_EXCLUDED_URLS.every((url) => !request.url.includes(url));
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const subscriptionId = this.accManagement.getSubscription();
    const realm = this.accManagement.getCurrentRealm();

    let modifiedReq: HttpRequest<any>;
    if (subscriptionId && realm && this.isXtenantForbidden(req)) {
      modifiedReq = req.clone({
        headers: req.headers.set(X_SUBSCRIPTION, subscriptionId.id).set(X_TENANT, realm.name),
      });
    } else if (realm && this.isXtenantForbidden(req)) {
      modifiedReq = req.clone({
        headers: req.headers.set(X_TENANT, realm.name),
      });
    } else if (subscriptionId) {
      modifiedReq = req.clone({
        headers: req.headers.set(X_SUBSCRIPTION, subscriptionId.id),
      });
    }
    return next.handle(modifiedReq ? modifiedReq : req).pipe( tap(() => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }
          this.authService.logout();
        }
      }));
  }
}
