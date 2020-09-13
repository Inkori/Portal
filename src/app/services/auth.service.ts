import {Injectable} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private keycloak: KeycloakService,
              private router: Router) {
  }

  public login() {
    this.keycloak.login();
  }

  public logout(): void {
    this.keycloak.logout();
  }

  public isLoggedIn() {
    this.keycloak.isLoggedIn();
  }

}
