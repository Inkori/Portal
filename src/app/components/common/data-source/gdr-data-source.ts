import {OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {finalize, map, pluck, takeUntil} from 'rxjs/operators';
import {CommonResponse, PageRequest} from '../../../models/acc-management';
import {CommonDataSource, Page, PageInner} from '../../../models/common';
import {GdrDevice} from '../../../models/gdr';
import {GdrService} from '../../../services/gdr.service';

export class GdrDataSource<T> extends CommonDataSource<GdrDevice> implements OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  private loadingSubject = new Subject<boolean>();
  private responseSubject = new Subject<CommonResponse>();

  public page$ = this.responseSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();

  constructor(private gdrService: GdrService) {
    super();
  }

  public ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public connect(): Observable<GdrDevice[]> {
    return this.page$.pipe(pluck('content'));
  }

  public disconnect(): void {
    this.responseSubject.complete();
    this.loadingSubject.complete();
  }

  public load(request: PageRequest) {
    this.loadingSubject.next(true);
    if (!request.freeText) {
      this.gdrService.getDevicesGdr(request)
        .pipe(
          map((data)  => ({content: data.content, page: this.createPage(data)})),
          finalize(() => this.loadingSubject.next(false)),
          takeUntil(this.subscriptions$))
        .subscribe((data) => {
          this.responseSubject.next(data);
        });
    } else {
      this.gdrService.search(request)
        .pipe(
          map((data)  => ({content: data.content, page: this.createPage(data)})),
          finalize(() => this.loadingSubject.next(false)),
          takeUntil(this.subscriptions$))
        .subscribe((data) => {
          this.responseSubject.next(data);
        });
    }

  }
  private createPage(data: Page<any>): PageInner {
    return {number: data.number, size: data.size, totalElements: data.totalElements, totalPages: data.totalPages };
  }

}
