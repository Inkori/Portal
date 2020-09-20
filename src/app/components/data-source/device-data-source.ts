import {DataSource} from '@angular/cdk/collections';
import {Device} from '../../models/device';
import {Observable, Subject} from 'rxjs';
import {DeviceProfileService} from '../../services/device-profile.service';
import {Page, ParamRequest} from '../../models/common';
import {finalize, pluck, takeUntil} from 'rxjs/operators';
import {OnDestroy} from '@angular/core';

export class DeviceDataSource<T> implements DataSource<Device>, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
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

    this.deviceProfileService.getDevicesFromApi(request)
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        takeUntil(this.subscriptions$))
      .subscribe(devices => {
        this.devicesSubject.next(devices);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }
}
