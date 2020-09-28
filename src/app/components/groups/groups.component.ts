import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataSourceType} from '../../models/common';
import {MatDialog} from '@angular/material/dialog';
import {TableComponent} from '../table/table.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy {
  pageName = 'Groups page';
  dataSourceType = DataSourceType.GROUP;
  selectedIds = [];

  @ViewChild(TableComponent) tableComponent: TableComponent;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }
  getIdList(idList: string[]) {
    this.selectedIds = idList;
  }

  assign() {
   this.tableComponent.assign(DataSourceType.DEVICE);
  }

}
