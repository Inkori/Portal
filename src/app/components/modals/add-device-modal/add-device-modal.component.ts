import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ADD_DEVICE_FORM} from '../../../common/form-constants';
import {AIM_ALL} from '../../../common/constants';
import {DeviceProfileService} from '../../../services/device-profile.service';
import {FormService} from '../../../services/form.service';
import {FormSupplier} from '../../../models/common';

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
              private formService: FormService,
              @Inject(MAT_DIALOG_DATA) data) {
  }

  close() {
    this.dialogRef.close();
  }

  registrationTypeChange(type: string) {
    this.registrationType = type;
    const formSupplier = this.formService.prepareForm(ADD_DEVICE_FORM, type);
    this.form = formSupplier.form;
    this.addDeviceProps = formSupplier.props;
  }


  submit() {
    this.dialogRef.close({
      form: this.form.value,
      regType: this.registrationType
    });
  }
}
