import {Injectable} from '@angular/core';
import {Environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GdrService {
  // https://api.naea1.uds-dev.lenovo.com/global-device-registry-service/lcp/apis/v1/deviceregistry?page=0&size=25&sort=name,ASC
  private url: string;

  constructor(private http: HttpClient) { this.url = Environment.portalUrl + '/global-device-registry-service/lcp/apis/v1'; }

  getDevicesGdr(){

  }
}
