import {KeycloakService} from 'keycloak-angular';
import {keycloakConfig} from './environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return () =>
    keycloak.init({
      config: keycloakConfig,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}
