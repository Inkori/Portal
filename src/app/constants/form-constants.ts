import {Validators} from '@angular/forms';
import {
  AIM_AUTO,
  COMMON_NAME_ERROR_MESSAGE,
  COMMON_NAME_REGEXP,
  DEVICE_COMMON_UPPER_CASE_ERROR_MESSAGE,
  DEVICE_COMMON_UPPER_CASE_REGEXP,
  TYPE_TEXT
} from './constants';

export const ADD_DEVICE_FORM = {
  deviceName: {
    label: 'Device Name (optional)',
    type: TYPE_TEXT,
    aim: '',
    validators: [
      Validators.pattern(COMMON_NAME_REGEXP),
    ],
    errorMessages: {
      regex: COMMON_NAME_ERROR_MESSAGE
    }
  },
  activationCode: {
    label: 'Secure Activation Code',
    type: TYPE_TEXT,
    aim: AIM_AUTO,
    validators: [
      Validators.required,
      Validators.pattern(DEVICE_COMMON_UPPER_CASE_REGEXP),
    ],
    errorMessages: {
      regex: DEVICE_COMMON_UPPER_CASE_ERROR_MESSAGE
    }
  },
  serialNumber: {
    label: 'Serial Number',
    type: TYPE_TEXT,
    aim: '',
    validators: [
      Validators.required,
      Validators.pattern(DEVICE_COMMON_UPPER_CASE_REGEXP),
    ],
    errorMessages: {
      regex: DEVICE_COMMON_UPPER_CASE_ERROR_MESSAGE
    },
  }
};

export const ADD_GROUP_FORM = {
  groupName: {
    label: 'Group name',
    type: TYPE_TEXT,
    aim: '',
    validators: [Validators.required,
      Validators.pattern(COMMON_NAME_REGEXP),
    ],
    errorMessages: {
      regex: DEVICE_COMMON_UPPER_CASE_ERROR_MESSAGE
    }
  }
};
