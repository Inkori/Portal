import {OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {finalize, pluck, takeUntil} from 'rxjs/operators';
import {Group, GroupsPageRequest, GroupsResponse} from '../../../models/acc-management';
import {CommonDataSource} from '../../../models/common';
import {AccountManagementService} from '../../../services/account-management.service';

export class GroupsDataSource<T> extends CommonDataSource<Group> implements OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  private loadingSubject = new Subject<boolean>();
  private groupsSubject = new Subject<GroupsResponse>();

  public page$ = this.groupsSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();

  constructor(private accountManagementService: AccountManagementService) {
    super();
  }

  public connect(): Observable<Group[]> {
    return this.page$.pipe(pluck('_embedded', 'groupList'));
  }

  public disconnect(): void {
    this.groupsSubject.complete();
    this.loadingSubject.complete();
  }

  public load(request: GroupsPageRequest) {
    this.loadingSubject.next(true);

    this.accountManagementService.getGroupsList(request)
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        takeUntil(this.subscriptions$))
      .subscribe((groups) => {
        this.groupsSubject.next(groups);
      });
  }

  public ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }
}
