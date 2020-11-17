import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {pluck} from 'rxjs/operators';
import {Environment} from '../../environments/environment';
import {ORG_REALMS, REALM, SUBSCRIPTION_ID} from '../constants/constants';
import {GroupsPageRequest, GroupsResponse, Organization} from '../models/acc-management';
import {DeviceIdInfo, GroupAddParam, GroupDeleteParam, Page} from '../models/common';
import {Subscription} from '../models/subscription';

@Injectable({
  providedIn: 'root',
})
export class AccountManagementService {
  private url: string;
  public currentSubscription$ = new Subject<Subscription>();
  public currentRealm$ = new Subject<Organization>();
  public orgListUpdateEvent$ = new Subject<Subscription>();
  public reloadPage$ = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.url = Environment.portalUrl + '/lcp-account-management/apis/v1';
  }

  public getRealmsFromApi(subscription: Subscription): Observable<Organization[]> {
    const params = new HttpParams().set(SUBSCRIPTION_ID, subscription.id);
    this.removeCurrentRealm();

    return this.http.get<Page<Organization>>(this.url + '/organizations', {params})
      .pipe(
        pluck('_embedded', 'organizationList'));
  }

  public getGroupsList(pageRequest: GroupsPageRequest): Observable<GroupsResponse> {
    const params = this.getHttpParams(pageRequest);
    return this.http.get<GroupsResponse>(this.url + '/groups', {params});
  }

  public assignGroupsBulk(deviceAddParamList: DeviceIdInfo[], groupParamList: string[]): Observable<void> {
    return this.http.post<void>(this.url + '/groups/devices/addBulk', {deviceAddParamList, groupParamList});
  }

  public createGroup(groupAddParam: GroupAddParam): Observable<any> {
    return this.http.post<void>(this.url + '/groups', groupAddParam);
  }

  public deleteGroup(groupAddParam: GroupDeleteParam): Observable<any> {
    return this.http.patch<void>(this.url + '/groups', groupAddParam);
  }

  public sendOrgUpdateEvent(subscription: Subscription) {
    this.orgListUpdateEvent$.next(subscription);
  }

  public reloadRage(): void {
    this.reloadPage$.next(true);
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

  public getCurrentRealm(): Organization {
    return JSON.parse(localStorage.getItem(REALM));
  }

  public isRealmSelected(): boolean {
    return !!localStorage.getItem(REALM);
  }

  public isSubscriptionSelected() {
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
      .set('sortByDirection', `${pageRequest.sortByDirection ? 'ASC' : 'DESC'}`)
      .set('freeText', `${pageRequest.freeText}`);
  }
}
