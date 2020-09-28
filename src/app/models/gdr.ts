import {Page} from './common';

export class GdrDeviceResponse implements Page<GdrDevice> {
  readonly content: GdrDevice[];
  readonly number: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
}

export class GdrDevice {
  device_id: string;
  lcp_deviceKey_pub: PublicKey;
  mt: string;
  mtm: string;
  sn: string;
}

export class PublicKey {
  key: string;
  keyEncoding: string;
  type: string;
}
