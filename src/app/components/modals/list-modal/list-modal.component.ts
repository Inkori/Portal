import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataType} from '../../../models/common';

@Component({
  selector: 'app-device-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.css'],
})
export class ListModalComponent implements OnInit {
  public selectedIds = [];
  public dataSourceType: DataType;

  constructor(private dialogRef: MatDialogRef<ListModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  public ngOnInit(): void {
    this.dataSourceType = this.data.type;
  }

  public close() {
    this.dialogRef.close();
  }

  public submit() {
    this.dialogRef.close(this.selectedIds);
  }

  public getIdList(idList: string[]) {
    this.selectedIds = idList;
  }
}
