import {KeycloakConfig} from 'keycloak-js';
import {Subscription} from '../app/models/subscription';

export class Environment {
  static portalUrl = 'https://api.naea1.uds-dev.lenovo.com';
  production = false;
  keycloakUrl = 'https://auth.naea1.uds-dev.lenovo.com/auth';
}

export const environment = new Environment();

export let keycloakConfig: KeycloakConfig = {
  url: environment.keycloakUrl,
  realm: 'LCPRealm',
  clientId: 'LCPRealm'
};
export const subscriptionIds: Subscription[] = [
  {name: 'Think-Reality', id: '4cbdbb11-e604-43d2-b53a-2a9a5ad6c9cc'},
  {name: 'Think-Shield', id: '03180bf3-f3ed-4ee9-8e45-b8dd60e20927'},
  {name: 'Modern-Preload', id: 'c915fedc-aab3-4509-a588-9d8365f31079'},
  {name: 'Think-Smart', id: 'dfaa8d1b-a955-4359-a2b1-3e66219e8f9d'},
  {name: 'Predictive-Maintenance', id: '770297f8-cd6a-11e9-a32f-2a2ae2dbcce4'},
  {name: 'Commercial VR', id: 'b6b9984a-8c76-4e84-8a8d-2d04d01a87d1'},
  {name: 'VR Classroom 2', id: '2b70a3d1-bff3-4ba8-bb96-0856e206cc6b'},
  {name: 'Lenovo-Voice', id: '11ffef2f-7d75-4834-8297-88c5d60d2379'}
];


