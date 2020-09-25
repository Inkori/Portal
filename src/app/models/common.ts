import {FormGroup} from '@angular/forms';

export interface Page<T> {
  readonly number: number;
  readonly size: number;
  readonly content?: T[];
  readonly _embedded?: { [key: string]: T[] };
  readonly totalElements: number;
  readonly totalPages: number;
}

export interface ParamRequest {
  pageNumber?: number;
  pageSize?: number;
  sortByProperty?: string;
  sortByDirection?: string;
  freeText?: string;
}

export interface AddDeviceManual {
  deviceName?: string;
  deviceSerialnumber: string;
}

export interface AddDeviceClaim {
  device_name?: string;
  mt: string;
  sn: string;
  token: string;
}

export interface AddDeviceModalRequest {
  form: any;
  regType: string;
}

export interface DeviceIdInfo {
  deviceId: string;
}

export interface AddGroupRequest {
  deviceAddParamList: DeviceIdInfo[];
  groupParamList: [];
}

export interface FormSupplier {
  form: FormGroup;
  props: Array<any>;
}
