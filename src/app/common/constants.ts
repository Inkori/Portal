// local storage
import {ParamRequest} from '../models/common';
import {GroupsPageRequest, GroupType} from '../models/acc-management';

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
export const COMMON_NAME_REGEXP = /^[\w\s-]+$/;
export const DEVICE_COMMON_UPPER_CASE_REGEXP = /^[A-Z0-9]*$/;
export const DEVICE_COMMON_UPPER_CASE_ERROR_MESSAGE = 'You can use only numbers and letters in upper case';
export const COMMON_NAME_ERROR_MESSAGE = 'You can use numbers, letters, underscore, space';
export const REGISTRATION_TITLES = {auto: 'Auto registration', manual: 'Manual registration', group: 'Add group'};


// registration forms
export const AIM_ALL = 'All';
export const AIM_AUTO = 'Auto';
export const TYPE_TEXT = 'text';
export const TYPE_CHECKBOX = 'checkbox';

// messages
export const DEVICE_ADD_ERROR_MESSAGE = 'Can\'t add device. Reason: ';
export const DEVICE_ADD_MESSAGE = 'Device has been added';
export const GROUP_CREATE_ERROR_MESSAGE = 'Can\'t add group. Reason: ';
export const GROUP_CREATE_MESSAGE = 'Group has been created';
export const GROUP_ASSIGN_ERROR_MESSAGE = 'Can\'t assign group. Reason: ';
export const GROUP_ASSIGN_MESSAGE = 'Group has been assigned';
export const GROUP_DELETE_ERROR_MESSAGE = 'Can\'t delete group. Reason: ';
export const GROUP_DELETE_MESSAGE = 'Group has been deleted';
export const DEVICE_DELETE_ERROR_MESSAGE = 'Can\'t delete device. Error: ';
export const DEVICE_DELETE_MESSAGE = 'Selected devices have been deleted';
export const GROUP_LIST_EMPTY_MESSAGE = 'This organisation doesn\'t have groups';
export const GROUP_SEARCH_RESPONSE_EMPTY_MESSAGE = 'Group with current search params doesn\'t exist';
export const DEVICE_LIST_EMPTY_MESSAGE = 'This organisation doesn\'t have devices';
export const DEVICE_SEARCH_RESPONSE_EMPTY_MESSAGE = 'Device with current search params doesn\'t exist';

// requests
export const DEFAULT_DEVICE_PARAM_REQUEST: ParamRequest = Object.freeze({
  pageNumber: 0, pageSize: 7, sortByProperty: 'deviceName', sortByDirection: ASC, freeText: ''
});
export const DEFAULT_GROUP_PARAM_REQUEST: GroupsPageRequest = {
  'type': GroupType.DEVICE, activityState : 'ACTIVE', pageNumber: 0, pageSize: 5, sortByProperty: 'displayName', sortByDirection: true, freeText: '',
}

// entity type
export const TYPE_DEVICE = 'DEVICE';
export const TYPE_GROUP = 'GROUP';

// table columns
export const DEVICE_TABLE_COLUMNS = ['selectId', 'deviceState.status', 'deviceName', 'deviceSerialnumber', 'groups'];
export const GROUP_TABLE_COLUMNS = ['groupId', 'name'];
