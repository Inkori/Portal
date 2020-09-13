import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Device, Devices} from './device';
import {BehaviorSubject, Observable} from 'rxjs';
import {DeviceProfileService} from '../services/device-profile.service';
import {ParamRequest} from './common';
import {finalize} from 'rxjs/operators';
import {defaultDeviceParamRequest} from '../common/constants';

export class DeviceDataSource implements DataSource<Device> {
  private devices: Devices;
  private paramRequest = defaultDeviceParamRequest;

  private devicesSubject = new BehaviorSubject<Device[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // private paginator = new BehaviorSubject<ParamRequest>(this.paramRequest);

  public devicesSubject$ = this.devicesSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();

  // public paginator$ = this.paginator.asObservable();

  constructor(private deviceProfileService: DeviceProfileService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Device[]> {
    return this.devicesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.devicesSubject.complete();
    this.loadingSubject.complete();
  }

  loadDevices(request: ParamRequest) {

    this.loadingSubject.next(true);

    this.deviceProfileService.getDevicesFromApi(request)
      .pipe(
        finalize(() => this.loadingSubject.next(false)))
      .subscribe(devices => {
        this.devicesSubject.next(devices.content);
        this.devices = devices;
      });
  }

  getDevices(): Devices {
    // console.log('getDevices!');
    return this.devices;
  }
}
