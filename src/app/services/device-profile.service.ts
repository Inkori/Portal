import {Injectable} from '@angular/core';
import {Environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Device, Devices} from '../models/device';
import {Observable, Subject} from 'rxjs';
import {ParamRequest} from '../models/common';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceProfileService {
  url: string;
  reloadDeviceList$ = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.url = Environment.portalUrl + '/device-profile-service/lcp/apis/v1/devices';
  }

  getDevicesFromApi(request: ParamRequest): Observable<Devices> {
    const params = this.getHttpParams(request);
    return this.http.get<Devices>(this.url, {params});
  }

  reloadDevicesForCurrentOrg(): void {
    this.reloadDeviceList$.next(true);
  }

  getHttpParams(request: ParamRequest): HttpParams {
    const {pageNumber, pageSize, sortByProperty, sortByDirection} = request;
    return new HttpParams()
      .set('page', `${pageNumber}`)
      .set('size', `${pageSize}`)
      .set('sort', `${sortByProperty},${sortByDirection}`);
  }
}

