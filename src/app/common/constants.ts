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

// param request
export const defaultDeviceParamRequest: ParamRequest = {pageNumber: 0, pageSize: 7, sortByProperty: 'deviceName', sortByDirection: ASC};
