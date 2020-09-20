// local storage
import {ParamRequest} from '../models/common';

export const REALM = 'realm';
export const SUBSCRIPTION_ID = 'subscriptionId';
export const ORG_REALMS = 'org_realms';

// headers
export const X_TENANT = 'x-tenant';
export const X_SUBSCRIPTION = 'x-subscription';

// directions
export const ASC = 'ASC';
export const DESC = 'DESC';

// registration
export const DEVICE_NAME_REGEXP = /^[\w\s-]+$/;
export const DEVICE_COMMON_UPPER_CASE_REGEXP = /^[A-Z0-9]*$/;
export const DEVICE_COMMON_UPPER_CASE_ERROR_MESSAGE = 'You can use only numbers and letters in upper case';
export const DEVICE_NAME_ERROR_MESSAGE = 'You can use numbers, letters, underscore, space';

// registration forms
export const AIM_ALL = 'All';
export const AIM_AUTO = 'Auto';
export const TYPE_TEXT = 'text';

// errors
export const DEVICE_ADD_ERROR_MESSAGE = 'Can\'t add device. Reason: ';
export const DEVICE_ADDED_MESSAGE = 'Device has been added';
export const DEVICE_DELETE_ERROR_MESSAGE = 'Can\'t delete device. Error: ';
export const DEVICE_DELETE_MESSAGE = 'Selected devices have been deleted';

// param request
export const DEFAULT_DEVICE_PARAM_REQUEST: ParamRequest = Object.freeze({
  pageNumber: 0, pageSize: 7, sortByProperty: 'deviceName', sortByDirection: ASC, freeText: ''
});
