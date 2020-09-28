import {Observable, Subject} from 'rxjs';
import {finalize, map, pluck, takeUntil} from 'rxjs/operators';
import {OnDestroy} from '@angular/core';
import {CommonDataSource, Page, PageInner, ParamRequest} from '../../../models/common';
import {GdrDevice} from '../../../models/gdr';
import {GdrService} from '../../../services/gdr.service';
import {CommonResponse} from '../../../models/acc-management';

export class GdrDataSource<T> extends CommonDataSource<GdrDevice> implements OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  private loadingSubject = new Subject<boolean>();
  private responseSubject = new Subject<CommonResponse>();

  public page$ = this.responseSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();

  constructor(private gdrService: GdrService) {
    super();
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  connect(): Observable<GdrDevice[]> {
    return this.page$.pipe(pluck('content'));
  }

  disconnect(): void {
    this.responseSubject.complete();
    this.loadingSubject.complete();
  }

  load(request: ParamRequest) {
    this.loadingSubject.next(true);
    if (!request.freeText) {
      this.gdrService.getDevicesGdr(request)
        .pipe(
          map(data  => ({content: data.content, page: this.createPage(data)})),
          finalize(() => this.loadingSubject.next(false)),
          takeUntil(this.subscriptions$))
        .subscribe(data => {
          this.responseSubject.next(data);
        });
    } else {
      this.gdrService.search(request)
        .pipe(
          map(data  => ({content: data.content, page: this.createPage(data)})),
          finalize(() => this.loadingSubject.next(false)),
          takeUntil(this.subscriptions$))
        .subscribe(data => {
          this.responseSubject.next(data);
        });
    }

  }
  private createPage(data: Page<any>): PageInner{
    return {number: data.number, size: data.size, totalElements: data.totalElements, totalPages: data.totalPages }
  }

}
