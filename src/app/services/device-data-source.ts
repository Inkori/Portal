import {DataSource} from '@angular/cdk/collections';
import {Device} from '../models/device';
import {Observable, Subject, Subscription} from 'rxjs';
import {DeviceProfileService} from './device-profile.service';
import {Page, ParamRequest} from '../models/common';
import {finalize, pluck} from 'rxjs/operators';
import {OnDestroy} from '@angular/core';

// this service used only for devices page, so we can implement onDestroy method and it will be called after destroying device page
export class DeviceDataSource<T> implements DataSource<Device>, OnDestroy{
  subscriptions: Subscription = new Subscription();
  private loadingSubject = new Subject<boolean>();
  private devicesSubject = new Subject<Page<Device>>();

  public page$ = this.devicesSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();

  constructor(private deviceProfileService: DeviceProfileService) {
  }

  connect(): Observable<Device[]> {
    return this.page$.pipe(pluck('content'));
  }

  disconnect(): void {
    this.devicesSubject.complete();
    this.loadingSubject.complete();
  }

   loadDevices(request: ParamRequest) {
    this.loadingSubject.next(true);

    this.subscriptions.add(this.deviceProfileService.getDevicesFromApi(request)
      .pipe(
        finalize(() => this.loadingSubject.next(false)))
      .subscribe(devices => {
        this.devicesSubject.next(devices);
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
