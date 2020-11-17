import {OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {finalize, map, pluck, takeUntil} from 'rxjs/operators';
import {CommonResponse, PageRequest} from '../../../models/acc-management';
import {CommonDataSource, Page, PageInner} from '../../../models/common';
import {Device} from '../../../models/device';
import {DeviceProfileService} from '../../../services/device-profile.service';

export class DeviceDataSource<T> extends CommonDataSource<Device> implements OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  private loadingSubject = new Subject<boolean>();
  private devicesSubject = new Subject<CommonResponse>();

  public page$ = this.devicesSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();

  constructor(private deviceProfileService: DeviceProfileService) {
    super();
  }

  public connect(): Observable<Device[]> {
    return this.page$.pipe(pluck('content'));
  }

  public disconnect(): void {
    this.devicesSubject.complete();
    this.loadingSubject.complete();
  }

  public load(request: PageRequest) {
    this.loadingSubject.next(true);

    this.deviceProfileService.getDevicesFromApi(request)
      .pipe(
        map((data) => ({content: data.content, page: this.createPage(data)})),
        finalize(() => this.loadingSubject.next(false)),
        takeUntil(this.subscriptions$))
      .subscribe((devices) => {
        this.devicesSubject.next(devices);
      });
  }

  private createPage(data: Page<any>): PageInner {
    return {number: data.number, size: data.size, totalElements: data.totalElements, totalPages: data.totalPages};
  }

  public ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }
}
