import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Environment} from '../../environments/environment';
import {AppStats, AssetStats, DevicesStat, UserStats} from '../models/stats';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = Environment.portalUrl;
  }

  public getAssetStats(): Observable<AssetStats> {
    return this.http.get<AssetStats>(`${this.url}/assets-management-service/lcp/apis/v1/xr-assets/statistic`);
  }

  public getUsersStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.url}/lcp-account-management/apis/v1/users/stats`);
  }

  public getDevicesStats(): Observable<DevicesStat> {
    return this.http.get<DevicesStat>(`${this.url}/device-profile-service/lcp/apis/v1/devices/statistics/devices-by-status`);
  }

  public getAppsStats(): Observable<AppStats> {
    return this.http.get<AppStats>(`${this.url}/application-management-service/lcp/apis/v1/apps/statistic`);
  }
}
