import {Injectable} from '@angular/core';
import {Environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Device} from '../models/device';
import {Observable, Subject} from 'rxjs';
import {AddDeviceClaim, AddDeviceManual, Page, ParamRequest} from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class DeviceProfileService {
  url: string;
  reloadDeviceList$ = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.url = Environment.portalUrl + '/device-profile-service/lcp/apis/v1/devices';
  }

  getDevicesFromApi(request: ParamRequest): Observable<Page<Device>> {
    const params = this.getHttpParams(request);
    return this.http.get<Page<Device>>(this.url, {params});
  }

  reloadDevicesForCurrentOrg(): void {
    this.reloadDeviceList$.next(true);
  }

  deleteDevices(ids: string[]): Observable<any> {
    return this.http.post(this.url + '/bulk-delete', ids);
  }

  getHttpParams(request: ParamRequest): HttpParams {
    const {pageNumber, pageSize, sortByProperty, sortByDirection, freeText} = request;
    return new HttpParams()
      .set('page', `${pageNumber}`)
      .set('size', `${pageSize}`)
      .set('sort', `${sortByProperty},${sortByDirection}`)
      .set('freeText', `${freeText}`);
  }

  addDeviceManually(params: AddDeviceManual[]): Observable<Blob> {
    return this.http.post(this.url + '/batch', params, {responseType: 'blob'});
  }

  addDeviceClaim(params: AddDeviceClaim): Observable<any> {
    return this.http.post(this.url + '/activation/claim', params);
  }
}

