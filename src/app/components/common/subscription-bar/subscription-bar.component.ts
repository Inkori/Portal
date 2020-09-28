import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {routes} from '../../../app-routing.module';
import {Routes} from '@angular/router';
import {Subscription} from '../../../models/subscription';
import {subscriptionIds} from '../../../../environments/environment';
import {AccountManagementService} from '../../../services/account-management.service';

@Component({
  selector: 'app-subscription-bar',
  templateUrl: './subscription-bar.component.html',
  styleUrls: ['./subscription-bar.component.css']
})
export class SubscriptionBarComponent implements OnInit {
  myRoutes: Routes = routes.slice(1, -2);
  subscriptions: Subscription[];
  currentSubscription: Subscription;

  constructor(private keycloak: KeycloakService, private accManagement: AccountManagementService) {
  }

  ngOnInit(): void {
    this.subscriptions = subscriptionIds;
    this.currentSubscription = this.accManagement.getSubscription();
  }

  logout() {
    this.keycloak.logout();
  }

  setSubscription(subscription: Subscription) {
    this.accManagement.setSubscription(subscription);
    this.accManagement.sendOrgUpdateEvent(subscription);
    this.currentSubscription = subscription;
  }
}
