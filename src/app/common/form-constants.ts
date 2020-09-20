import {Validators} from '@angular/forms';
import {
  AIM_ALL,
  AIM_AUTO,
  DEVICE_COMMON_UPPER_CASE_ERROR_MESSAGE,
  DEVICE_COMMON_UPPER_CASE_REGEXP,
  DEVICE_NAME_ERROR_MESSAGE,
  DEVICE_NAME_REGEXP,
  TYPE_TEXT
} from './constants';

export const ADD_DEVICE_FORM = {
  deviceName: {
    label: 'Device Name (optional)',
    type: TYPE_TEXT,
    aim: AIM_ALL,
    validators: [
      Validators.pattern(DEVICE_NAME_REGEXP),
    ],
    errorMessages: {
      regex: DEVICE_NAME_ERROR_MESSAGE
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
    aim: AIM_ALL,
    validators: [
      Validators.required,
      Validators.pattern(DEVICE_COMMON_UPPER_CASE_REGEXP),
    ],
    errorMessages: {
      regex: DEVICE_COMMON_UPPER_CASE_ERROR_MESSAGE
    },
  }
};
