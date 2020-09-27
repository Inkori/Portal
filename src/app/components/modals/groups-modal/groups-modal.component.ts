import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataSourceType} from '../../../models/common';

@Component({
  selector: 'app-groups-modal',
  templateUrl: './groups-modal.component.html',
  styleUrls: ['./groups-modal.component.css']
})
export class GroupsModalComponent {

  loading: boolean;
  selectedIds = [];
  tableType = DataSourceType.GROUP;

  constructor(private dialogRef: MatDialogRef<GroupsModalComponent>, @Inject(MAT_DIALOG_DATA) data) {
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.selectedIds);
  }

  getIdList(idList: string[]) {
    this.selectedIds = idList;
  }
}
