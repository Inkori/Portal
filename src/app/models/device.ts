export class Device {
  public orgDeviceId: string;
  public deviceId: string;
  public deviceName: string;
  public deviceDisplayName: string;
  public deviceManufacturer: string;
  public deviceModelType: string;
  public deviceSerialnumber: string;
  public deviceFamily: string;
  public deviceEnclosureType: string;
  public deviceAuth: {};
  public orgId: string;
  public groupId: string;
  public groupName: string;
  public dateCreated: string;
  public dateModified: string;
  public deviceMetadata: DeviceMetadata;
  public deviceState: {
    status: DeviceStatus | DeviceStatusCapitalize;
  };
  public deviceConfig: string;
  public subscriptionId: string;
  public groups: GroupsInDevice[];
  public licenseType?: unknown;
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

export class GroupsInDevice {
  public groupId: string;
  public groupName: string;
}
