import {Observable, Subject} from 'rxjs';
import {finalize, pluck, takeUntil} from 'rxjs/operators';
import {OnDestroy} from '@angular/core';
import {AccountManagementService} from '../../services/account-management.service';
import {Group, GroupsPageRequest, GroupsResponse} from '../../models/acc-management';
import {CommonDataSource} from '../../models/common';

export class GroupsDataSource<T> extends CommonDataSource<Group> implements OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  private loadingSubject = new Subject<boolean>();
  private groupsSubject = new Subject<GroupsResponse>();

  public page$ = this.groupsSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();

  constructor(private accountManagementService: AccountManagementService) {
    super();
  }

  connect(): Observable<Group[]> {
    return this.page$.pipe(pluck('_embedded', 'groupList'));
  }

  disconnect(): void {
    this.groupsSubject.complete();
    this.loadingSubject.complete();
  }

  load(request: GroupsPageRequest) {
    this.loadingSubject.next(true);

    this.accountManagementService.getGroupsList(request)
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        takeUntil(this.subscriptions$))
      .subscribe(groups => {
        this.groupsSubject.next(groups);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }
}
