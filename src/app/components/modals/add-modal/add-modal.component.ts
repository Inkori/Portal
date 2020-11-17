import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {REGISTRATION_TITLES, TYPE_GROUP} from '../../../constants/constants';
import {ADD_DEVICE_FORM, ADD_GROUP_FORM} from '../../../constants/form-constants';
import {DataType} from '../../../models/common';
import {FormService} from '../../../services/form.service';

@Component({
  selector: 'app-add-device-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css'],
})
export class AddModalComponent implements OnInit {
  public registrationType: string;
  public form: FormGroup;
  public addProps = [];
  public modalType: DataType;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<AddModalComponent>,
              private formService: FormService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  public ngOnInit(): void {
    this.modalType = this.data.type;
    if (this.modalType === DataType.GROUP) {
      this.registrationTypeChange(TYPE_GROUP);
    }
  }

  public close() {
    this.dialogRef.close();
  }

  public registrationTypeChange(type: string) {
    this.registrationType = type;
    const formSupplier = this.formService.prepareForm(this.getFormInfo(), type);
    this.form = formSupplier.form;
    this.addProps = formSupplier.props;
  }

  private getFormInfo() {
    if (this.modalType === DataType.DEVICE) { return ADD_DEVICE_FORM; } else { return ADD_GROUP_FORM; }
  }

  public submit() {
    this.dialogRef.close({
      form: this.form.value,
      regType: this.registrationType,
    });
  }

  public getTitle(): string {
    return REGISTRATION_TITLES[this.registrationType.toLowerCase()];
  }
}
