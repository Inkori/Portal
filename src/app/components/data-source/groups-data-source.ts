import {DataSource} from '@angular/cdk/collections';
import {Observable, Subject} from 'rxjs';
import {Page} from '../../models/common';
import {finalize, pluck, takeUntil} from 'rxjs/operators';
import {OnDestroy} from '@angular/core';
import {AccountManagementService} from '../../services/account-management.service';
import {Group, GroupsPageRequest} from '../../models/acc-management';

export class GroupsDataSource<T> implements DataSource<Group>, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  private loadingSubject = new Subject<boolean>();
  private groupsSubject = new Subject<Page<Group>>();

  public page$ = this.groupsSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();

  constructor(private accountManagementService: AccountManagementService) {
  }

  connect(): Observable<Group[]> {
    return this.page$.pipe(pluck('_embedded', 'groupList'));
  }

  disconnect(): void {
    this.groupsSubject.complete();
    this.loadingSubject.complete();
  }

  loadGroups(request: GroupsPageRequest) {
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
