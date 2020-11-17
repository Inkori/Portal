import {Page} from './common';

export class GdrDeviceResponse implements Page<GdrDevice> {
  public readonly content: GdrDevice[];
  public readonly number: number;
  public readonly size: number;
  public readonly totalElements: number;
  public readonly totalPages: number;
}

export class GdrDevice {
  public device_id: string;
  public lcp_deviceKey_pub: PublicKey;
  public mt: string;
  public mtm: string;
  public sn: string;
  public name: string;
  public mfr: string;
  public enclosure: string;
  public family: string;
}

export class PublicKey {
  public key: string;
  public keyEncoding: string;
  public type: string;
}
