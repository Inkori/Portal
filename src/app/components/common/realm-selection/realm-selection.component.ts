import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AccountManagementService} from '../../../services/account-management.service';
import {AuthService} from '../../../services/auth.service';
import {Organization} from '../../../models/acc-management';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-realm-selection',
  templateUrl: './realm-selection.component.html',
  styleUrls: ['./realm-selection.component.css']
})
export class RealmSelectionComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  realmList: Organization[];
  isRealmSelected: boolean;
  isSubscriptionSelected: boolean;
  currentRealm: string;

  constructor(
    private auth: AuthService,
    private accManagement: AccountManagementService) {
  }

  @Input() pageName: string;

  ngOnInit(): void {

    this.realmList = this.accManagement.getRealmsInOrg();
    this.isSubscriptionSelected = this.accManagement.isSubscriptionSelected();
    this.isRealmSelected = this.accManagement.isRealmSelected();
    if (this.isRealmSelected) {
      this.currentRealm = this.accManagement.getCurrentRealm().name;
    }
    this.accManagement.orgListUpdateEvent$.pipe( takeUntil(this.subscriptions$) ).subscribe(data => {
      this.accManagement.getRealmsFromApi(data).pipe( takeUntil(this.subscriptions$) ).subscribe(response => {
        this.realmList = response;
        this.accManagement.setRealmsInOrg(response);
      });
    });
    this.accManagement.currentSubscription$.pipe( takeUntil(this.subscriptions$) ).subscribe(data => {
      this.isSubscriptionSelected = !!data;
    });
    this.accManagement.currentRealm$.pipe( takeUntil(this.subscriptions$) ).subscribe(data => {
      this.isRealmSelected = !!data;
      if (!!!data) {
        this.currentRealm = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  setCurrentRealm(realm: Organization): void {
    this.accManagement.setCurrentRealm(realm);
    this.isRealmSelected = !!realm;
    this.currentRealm = realm.name;
  }

  reloadPage() {
    this.accManagement.reloadRage();
  }
}
