import {Injectable} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormSupplier} from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  prepareForm(initData: any, type?: string): FormSupplier {
    const formDataObj = {};
    const formProps = [];
    for (const prop of Object.keys(initData)) {
      if (initData[prop].aim === type || !initData[prop].aim) {
        formDataObj[prop] = new FormControl('', initData[prop].validators);
        formProps.push({
          key: prop,
          label: initData[prop].label,
          aim: initData[prop].aim,
          type: initData[prop].type,
          errorMessages: initData[prop].errorMessages
        });

      }
    }
    return {form: new FormGroup(formDataObj), props: formProps};
  }
}
