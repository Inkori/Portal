import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Environment} from '../../environments/environment';
import {PageRequest} from '../models/acc-management';
import {GdrDeviceResponse} from '../models/gdr';

@Injectable({
  providedIn: 'root',
})
export class GdrService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = Environment.portalUrl + '/global-device-registry-service/lcp/apis/v1';
  }

  public getDevicesGdr(request: PageRequest): Observable<GdrDeviceResponse> {
    const params = this.getHttpParams(request);
    return this.http.get<GdrDeviceResponse>(`${this.url}/deviceregistry`, {params});
  }

  public search(request: PageRequest): Observable<GdrDeviceResponse> {
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
