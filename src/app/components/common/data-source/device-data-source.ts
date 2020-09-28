import {Device} from '../../../models/device';
import {Observable, Subject} from 'rxjs';
import {DeviceProfileService} from '../../../services/device-profile.service';
import {CommonDataSource, Page, PageInner, ParamRequest} from '../../../models/common';
import {finalize, map, pluck, takeUntil} from 'rxjs/operators';
import {OnDestroy} from '@angular/core';
import {DevicesResponse} from '../../../models/acc-management';

export class DeviceDataSource<T> extends CommonDataSource<Device> implements OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  private loadingSubject = new Subject<boolean>();
  private devicesSubject = new Subject<DevicesResponse>();

  public page$ = this.devicesSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();

  constructor(private deviceProfileService: DeviceProfileService) {
    super();
  }

  connect(): Observable<Device[]> {
    return this.page$.pipe(pluck('content'));
  }

  disconnect(): void {
    this.devicesSubject.complete();
    this.loadingSubject.complete();
  }

  load(request: ParamRequest) {
    this.loadingSubject.next(true);

    this.deviceProfileService.getDevicesFromApi(request)
      .pipe(
        map(data  => ({content: data.content, page: this.createPage(data)})),
        finalize(() => this.loadingSubject.next(false)),
        takeUntil(this.subscriptions$))
      .subscribe(devices => {
        this.devicesSubject.next(devices);
      });
  }

  private createPage(data: Page<any>): PageInner{
       return {number: data.number, size: data.size, totalElements: data.totalElements, totalPages: data.totalPages }
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }
}
