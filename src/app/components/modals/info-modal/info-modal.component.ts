import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-info',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css'],
})
export class InfoModalComponent implements OnInit {
  public code: string;

  constructor(
    private dialogRef: MatDialogRef<InfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  public ngOnInit(): void {
   this.code = this.data.token;
  }

  public close() {
    this.dialogRef.close();
  }
}
