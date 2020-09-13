import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Environment} from '../../environments/environment';
import {ORG_REALMS, REALM, SUBSCRIPTION_ID} from '../common/constants';
import {Subscription} from '../models/subscription';
import {Organization} from '../models/organizations';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountManagementService {
  private url: string;
  currentSubscription$ = new Subject<Subscription>();
  currentRealm$ = new Subject<Organization>();
  currentRealmList$ = new Subject<Organization[]>();

  constructor(private http: HttpClient) {
    this.url = Environment.portalUrl + '/lcp-account-management/apis/v1/organizations';
  }

  public getRealmsFromApi(subscription: Subscription): void {
    const params = new HttpParams().set(SUBSCRIPTION_ID, subscription.id);
    this.removeCurrentRealm();

    const apiCall = this.http.get(this.url, {params})
      .pipe(
        map(json => json['_embedded']),
        map(embedded => embedded['organizationList']))
      .subscribe((response) => {
        this.setRealmsInOrg(response);
        this.currentRealmList$.next(response);
        apiCall.unsubscribe();
      });
  }

  public setSubscription(subscription: Subscription) {
    localStorage.setItem(SUBSCRIPTION_ID, JSON.stringify(subscription));
    this.currentSubscription$.next(subscription);
  }

  public getSubscription(): Subscription {
    return JSON.parse(localStorage.getItem(SUBSCRIPTION_ID));
  }

  public setRealmsInOrg(realms) {
    localStorage.setItem(ORG_REALMS, JSON.stringify(realms));
  }

  public getRealmsInOrg(): Organization[] {
    return JSON.parse(localStorage.getItem(ORG_REALMS));
  }

  public setCurrentRealm(realm: Organization) {
    localStorage.setItem(REALM, JSON.stringify(realm));
    this.currentRealm$.next(realm);
  }

  public removeCurrentRealm() {
    localStorage.removeItem(REALM);
    this.currentRealm$.next(null);
  }

  public getCurrentRealm(): Organization {
    return JSON.parse(localStorage.getItem(REALM));
  }

  public isRealmSelected(): boolean {
    return !!localStorage.getItem(REALM);
  }


  isSubscriptionSelected() {
    return !!this.getSubscription();
  }
}

