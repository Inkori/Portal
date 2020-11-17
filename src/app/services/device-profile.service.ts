import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Environment} from '../../environments/environment';
import {ActCodeRequest, ActCodeResponse, PageRequest} from '../models/acc-management';
import {AddDeviceClaim, AddDeviceManual, Page} from '../models/common';
import {Device} from '../models/device';

@Injectable({
  providedIn: 'root',
})
export class DeviceProfileService {
  public url: string;
  // https://api.naea1.uds-dev.lenovo.com/device-profile-service/lcp/apis/v1/devices/device-id/newAliasId

  constructor(private http: HttpClient) {
    this.url = Environment.portalUrl + '/device-profile-service/lcp/apis/v1/devices';
  }

  public getDevicesFromApi(request: PageRequest): Observable<Page<Device>> {
    const params = this.getHttpParams(request);
    return this.http.get<Page<Device>>(this.url, {params});
  }

  public deleteDevices(ids: string[]): Observable<any> {
    return this.http.post(this.url + '/bulk-delete', ids);
  }

  public addDeviceManually(params: AddDeviceManual[]): Observable<Blob> {
    return this.http.post(this.url + '/batch', params, {responseType: 'blob'});
  }

  public addDeviceClaim(params: AddDeviceClaim): Observable<any> {
    return this.http.post(this.url + '/activation/claim', params);
  }

  public getActivationCode(request: ActCodeRequest): Observable<ActCodeResponse> {
    return this.http.get<ActCodeResponse>(this.url + '/activation/activation-code/mt/' + request.mt + '/sn/' + request.sn);
  }

  private getHttpParams(request: PageRequest): HttpParams {
    const {pageNumber, pageSize, sortByProperty, sortByDirection, freeText} = request;
    return new HttpParams()
      .set('page', `${pageNumber}`)
      .set('size', `${pageSize}`)
      .set('sort', `${sortByProperty},${sortByDirection ? 'ASC' : 'DESC'}`)
      .set('freeText', `${freeText}`);
  }
}
