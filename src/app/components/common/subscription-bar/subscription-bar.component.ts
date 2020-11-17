import {Component, OnInit} from '@angular/core';
import {Routes} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';
import {subscriptionIds} from '../../../../environments/environment';
import {routes} from '../../../app-routing.module';
import {Subscription} from '../../../models/subscription';
import {AccountManagementService} from '../../../services/account-management.service';

@Component({
  selector: 'app-subscription-bar',
  templateUrl: './subscription-bar.component.html',
  styleUrls: ['./subscription-bar.component.css'],
})
export class SubscriptionBarComponent implements OnInit {
  public myRoutes: Routes = routes.slice(1, -2);
  public subscriptions: Subscription[];
  public currentSubscription: Subscription;

  constructor(private keycloak: KeycloakService, private accManagement: AccountManagementService) {
  }

  public ngOnInit(): void {
    this.subscriptions = subscriptionIds;
    this.currentSubscription = this.accManagement.getSubscription();
  }

  public logout() {
    this.keycloak.logout();
// just for test
    this.accManagement.setSubscription(null);
  }

  public setSubscription(subscription: Subscription) {
    this.accManagement.setSubscription(subscription);
    this.accManagement.sendOrgUpdateEvent(subscription);
    this.currentSubscription = subscription;
  }
}
