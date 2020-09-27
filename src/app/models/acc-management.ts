import {PageInner} from './common';

export enum OrgType {
  FREE = 'FREE',
  COMMERCIAL = 'COMMERCIAL',
}

export interface Address {
  street: string;
  country: string;
  countryCode: string;
}

export class Organization {
  addressInfo: Address;
  adminName: string;
  authType: OrganizationAuthorizationType;
  currency: string;
  dateCreated: string;
  displayName: string;
  logoUrl: string;
  phone: string;
  name: string;
  orgId: string;
  ownerEmail: string;
  subscriptionId: string;
  type: string;
  orgType?: OrgType;
  orgStatus?: OrganizationStatus;
  webUrl?: string;
  creatorId?: string;
  dateModified?: string;
}

export enum OrganizationAuthorizationType {
  LENOVO_ID = 'LENOVO_ID',
  FEDERATED_LDAP = 'FEDERATED_LDAP',
  SAML = 'SAML',
}

export enum OrganizationStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  INCOMPLETE = 'incomplete',
}

export enum GroupType {
  USER = 'USER',
  DEVICE = 'DEVICE',
  APP = 'APP',
}

export class PageRequest {
  pageNumber?: number;
  pageSize?: number;
  sortByProperty?: string;
  sortByDirection?: boolean;
  activityState?: string;
  freeText?: string;
  orgIds?: string;
}

export class GroupsPageRequest extends PageRequest {
  type: GroupType;
}

export class Group {
  apps: string[];
  creatorId: string;
  dateCreated: string;
  dateModified: string;
  devices: string[];
  disableIdentityIntegration: boolean;
  displayName: string;
  groupId: string;
  name: string;
  orgId: string;
  parentId: string;
  resourceUrl: string;
  type: GroupType;
  users: string[];
}

export class GroupsResponse {
  page: PageInner;
  _embedded: any;
}
