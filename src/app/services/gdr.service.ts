import {Injectable} from '@angular/core';
import {Environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GdrDeviceResponse} from '../models/gdr';
import {PageRequest} from '../models/acc-management';

@Injectable({
  providedIn: 'root'
})
export class GdrService {
  url: string;

  constructor(private http: HttpClient) {
    this.url = Environment.portalUrl + '/global-device-registry-service/lcp/apis/v1';
  }

  getDevicesGdr(request: PageRequest): Observable<GdrDeviceResponse> {
    const params = this.getHttpParams(request);
    return this.http.get<GdrDeviceResponse>(`${this.url}/deviceregistry`, {params});
  }

  search(request: PageRequest): Observable<GdrDeviceResponse> {
    const params = this.getHttpParams(request);

    return this.http
      .get<GdrDeviceResponse>(`${this.url}/deviceregistry/list-search`, {params});
  }

  private getHttpParams(request: PageRequest): HttpParams {
    const {pageNumber, pageSize, sortByProperty, sortByDirection, freeText} = request;
    return new HttpParams()
      .set('page', `${pageNumber}`)
      .set('size', `${pageSize}`)
      .set('sort', `${sortByProperty},${sortByDirection ? 'ASC' : 'DESC'}`)
      .set('key', `${freeText}`);
  }
}
