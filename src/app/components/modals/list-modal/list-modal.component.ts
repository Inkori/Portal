import {Component, Inject, OnInit} from '@angular/core';
import {DataSourceType} from '../../../models/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-device-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.css']
})
export class ListModalComponent implements OnInit {
  selectedIds = [];
  dataSourceType: DataSourceType;

  constructor(private dialogRef: MatDialogRef<ListModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
    this.dataSourceType = this.data.type;
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
