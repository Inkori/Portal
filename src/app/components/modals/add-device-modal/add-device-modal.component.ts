import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ADD_DEVICE_FORM} from '../../../common/form-constants';
import {AIM_ALL} from '../../../common/constants';
import {DeviceProfileService} from '../../../services/device-profile.service';

@Component({
  selector: 'app-add-device-modal',
  templateUrl: './add-device-modal.component.html',
  styleUrls: ['./add-device-modal.component.css']
})
export class AddDeviceModalComponent {
  registrationType: string;
  form: FormGroup;
  addDeviceProps = [];
  formDataObj = ADD_DEVICE_FORM;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<AddDeviceModalComponent>,
              private deviceProfileService: DeviceProfileService,
              @Inject(MAT_DIALOG_DATA) data) {
  }

  close() {
    this.dialogRef.close();
  }

  registrationTypeChange(type: string) {
    this.registrationType = type;
    this.changeForm();
  }


  private changeForm() {
    const formDataObj = {};
    this.addDeviceProps = [];
    for (const prop of Object.keys(this.formDataObj)) {
      if (this.formDataObj[prop].aim === this.registrationType || this.formDataObj[prop].aim === AIM_ALL) {
        formDataObj[prop] = new FormControl('', this.formDataObj[prop].validators);
        this.addDeviceProps.push({
          key: prop,
          label: this.formDataObj[prop].label,
          aim: this.formDataObj[prop].aim,
          type: this.formDataObj[prop].type,
          errorMessages: this.formDataObj[prop].errorMessages
        });
        this.form = new FormGroup(formDataObj);
      }
    }
  }

  submit() {
    this.dialogRef.close({
      form: this.form.value,
      regType: this.registrationType
    });
  }
}
