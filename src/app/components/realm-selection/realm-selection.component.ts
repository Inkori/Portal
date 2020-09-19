import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountManagementService} from '../../services/account-management.service';
import {AuthService} from '../../services/auth.service';
import {Organization} from '../../models/organizations';
import {DeviceProfileService} from '../../services/device-profile.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-realm-selection',
  templateUrl: './realm-selection.component.html',
  styleUrls: ['./realm-selection.component.css']
})
export class RealmSelectionComponent implements OnInit, OnDestroy {

  subscriptions: Subscription = new Subscription();
  realmList: Organization[];
  isRealmSelected: boolean;
  isSubscriptionSelected: boolean;
  currentRealm: string;

  constructor(
    private auth: AuthService,
    private accManagement: AccountManagementService,
    private deviceProfileService: DeviceProfileService) {
  }

  ngOnInit(): void {
    this.realmList = this.accManagement.getRealmsInOrg();
    this.isSubscriptionSelected = this.accManagement.isSubscriptionSelected();
    this.isRealmSelected = this.accManagement.isRealmSelected();
    if (this.isRealmSelected) {
      this.currentRealm = this.accManagement.getCurrentRealm().name;
    }
    this.subscriptions.add(this.accManagement.orgListUpdateEvent$.subscribe(data => {
      this.subscriptions.add(this.accManagement.getRealmsFromApi(data).subscribe(response => {
        this.realmList = response;
        this.accManagement.setRealmsInOrg(response);
      }));
    }));
    this.subscriptions.add(this.accManagement.currentSubscription$.subscribe(data => {
      this.isSubscriptionSelected = !!data;
    }));
    this.subscriptions.add(this.accManagement.currentRealm$.subscribe(data => {
      this.isRealmSelected = !!data;
      if (!!!data) {
        this.currentRealm = null;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setCurrentRealm(realm: Organization): void {
    this.accManagement.setCurrentRealm(realm);
    this.isRealmSelected = !!realm;
    this.currentRealm = realm.name;
  }

  reloadPage() {
    this.deviceProfileService.reloadDevicesForCurrentOrg();
  }
}
