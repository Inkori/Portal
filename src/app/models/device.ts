export class Device {
  orgDeviceId: string;
  deviceId: string;
  deviceName: string;
  deviceDisplayName: string;
  deviceManufacturer: string;
  deviceModelType: string;
  deviceSerialnumber: string;
  deviceFamily: string;
  deviceEnclosureType: string;
  deviceAuth: {};
  orgId: string;
  groupId: string;
  groupName: string;
  dateCreated: string;
  dateModified: string;
  deviceMetadata: DeviceMetadata;
  deviceState: {
    status: DeviceStatus | DeviceStatusCapitalize;
  };
  deviceConfig: string;
  subscriptionId: string;
  groups: GroupsInDevice[];
  licenseType?: unknown;
}

interface DeviceMetadata {
  [key: string]: string;
}

export enum DeviceStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  ERROR = 'error',
  ALERT = 'alert',
  DEACTIVATED = 'deactivated',
  UNCLAIMED = 'unclaimed',
  READY = 'ready',
  MANUALLY_ACTIVATED = 'manually activated',
  INVALID = 'invalid',
  OFFLINE = 'offline',
  ONLINE = 'online',
  UNAVAILABLE = 'unavailable',
  UNACTIVATED = 'unactivated',
}

export enum DeviceStatusCapitalize {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  UNCLAIMED = 'Unclaimed',
  UNACTIVATED = 'Unactivated',
}

export interface GroupsInDevice {
  groupId: string;
  groupName: string;
}

