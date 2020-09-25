import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Environment} from '../../environments/environment';
import {ORG_REALMS, REALM, SUBSCRIPTION_ID} from '../common/constants';
import {Subscription} from '../models/subscription';
import {Group, GroupsPageRequest, Organization} from '../models/acc-management';
import {pluck} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {DeviceIdInfo, Page} from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class AccountManagementService {
  private url: string;
  currentSubscription$ = new Subject<Subscription>();
  currentRealm$ = new Subject<Organization>();
  orgListUpdateEvent$ = new Subject<Subscription>();

  constructor(private http: HttpClient) {
    this.url = Environment.portalUrl + '/lcp-account-management/apis/v1';
  }

  getRealmsFromApi(subscription: Subscription): Observable<Organization[]> {
    const params = new HttpParams().set(SUBSCRIPTION_ID, subscription.id);
    this.removeCurrentRealm();

    return this.http.get<Page<Organization>>(this.url + '/organizations', {params})
      .pipe(
        pluck('_embedded', 'organizationList'));
  }

  getGroupsList(pageRequest: GroupsPageRequest): Observable<Page<Group>> {
    const params = this.getHttpParams(pageRequest);
    return this.http.get<Page<Group>>(this.url + '/groups', {params});
  }

  assignGroupsBulk(deviceAddParamList: DeviceIdInfo[], groupParamList: string[]): Observable<void> {
    return this.http.post<void>(this.url + '/groups/devices/addBulk', {deviceAddParamList, groupParamList});
  }

  sendOrgUpdateEvent(subscription: Subscription) {
    this.orgListUpdateEvent$.next(subscription);
  }

  setSubscription(subscription: Subscription) {
    localStorage.setItem(SUBSCRIPTION_ID, JSON.stringify(subscription));
    this.currentSubscription$.next(subscription);
  }

  getSubscription(): Subscription {
    return JSON.parse(localStorage.getItem(SUBSCRIPTION_ID));
  }

  setRealmsInOrg(realms) {
    localStorage.setItem(ORG_REALMS, JSON.stringify(realms));
  }

  getRealmsInOrg(): Organization[] {
    return JSON.parse(localStorage.getItem(ORG_REALMS));
  }

  setCurrentRealm(realm: Organization) {
    localStorage.setItem(REALM, JSON.stringify(realm));
    this.currentRealm$.next(realm);
  }

  getCurrentRealm(): Organization {
    return JSON.parse(localStorage.getItem(REALM));
  }

  isRealmSelected(): boolean {
    return !!localStorage.getItem(REALM);
  }

  isSubscriptionSelected() {
    return !!this.getSubscription();
  }

  private removeCurrentRealm() {
    localStorage.removeItem(REALM);
    this.currentRealm$.next(null);
  }

  private getHttpParams(pageRequest: GroupsPageRequest): HttpParams {
    return new HttpParams()
      .set('activityState', pageRequest.activityState)
      .set('type', pageRequest.type)
      .set('pageNumber', `${pageRequest.pageNumber}`)
      .set('pageSize', `${pageRequest.pageSize}`)
      .set('sortByPropertyList', pageRequest.sortByProperty)
      .set('sortByDirection', `${pageRequest.sortByDirection ? 'ASC' : 'DESC'}`);
  }
}

